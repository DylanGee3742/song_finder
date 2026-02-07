import { useState, useEffect, useRef, useCallback } from "react";

export function SwipeCard({ song, onSwipeLeft, onSwipeRight, entering, side, streak, isUpset }) {
  const startX = useRef(0);
  const curX = useRef(0);
  const dragging = useRef(false);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [gone, setGone] = useState(false);
  const [entered, setEntered] = useState(!entering);
  const [showUpset, setShowUpset] = useState(false);
  const TH = 80;

  useEffect(() => {
    if (entering) { const t = setTimeout(()=>setEntered(true), 30); return ()=>clearTimeout(t); }
  }, [entering]);

  useEffect(() => {
    if (isUpset) { setShowUpset(true); const t = setTimeout(()=>setShowUpset(false), 1200); return ()=>clearTimeout(t); }
  }, [isUpset]);

  const onStart = useCallback((cx, cy) => {
    if (gone) return;
    dragging.current = true; startX.current = cx; curX.current = 0;
  }, [gone]);
  const onMove = useCallback((cx, cy) => {
    if (!dragging.current) return;
    const x = cx - startX.current; curX.current = x;
    setDx(x); setDy((cy - (startX.current)) * 0.05);
  }, []);
  const onEnd = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const x = curX.current;
    if (Math.abs(x) > TH) {
      setGone(true); setDx(x>0?700:-700);
      setTimeout(()=>{ x>0 ? onSwipeRight?.() : onSwipeLeft?.(); }, 260);
    } else { setDx(0); setDy(0); }
  }, [onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    const mm = e => onMove(e.clientX, e.clientY);
    const mu = () => onEnd();
    const tm = e => onMove(e.touches[0].clientX, e.touches[0].clientY);
    const te = () => onEnd();
    window.addEventListener("mousemove", mm); window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm, {passive:true}); window.addEventListener("touchend", te);
    return () => { window.removeEventListener("mousemove",mm); window.removeEventListener("mouseup",mu);
      window.removeEventListener("touchmove",tm); window.removeEventListener("touchend",te); };
  }, [onMove, onEnd]);

  const rot = dx * 0.05;
  const leftO = Math.max(0, Math.min(1, -dx/TH));
  const rightO = Math.max(0, Math.min(1, dx/TH));
  const enterFrom = side==="left" ? "translate(-30px,40px) scale(.92)" : "translate(30px,40px) scale(.92)";

  let transform, opacity, transition;
  if (gone) { transform=`translate(${dx}px,${dy}px) rotate(${rot}deg)`; opacity=0; transition="all .35s cubic-bezier(.4,0,1,.6)"; }
  else if (!entered) { transform=enterFrom; opacity=0; transition="none"; }
  else if (dragging.current) { transform=`translate(${dx}px,${dy}px) rotate(${rot}deg)`; opacity=1; transition="none"; }
  else { transform=`translate(${dx}px,${dy}px) rotate(${rot}deg)`; opacity=1; transition="all .45s cubic-bezier(.175,.885,.32,1.1)"; }

  const hasStreak = streak >= 3;
  const glowColor = song.h !== undefined ? `hsl(${song.h},${song.s}%,50%)` : "#fff";

  return (
    <div className="sc" onMouseDown={e=>onStart(e.clientX,e.clientY)} onTouchStart={e=>onStart(e.touches[0].clientX,e.touches[0].clientY)}
      style={{ transform, opacity, transition, cursor:gone?"default":"grab",
        boxShadow: hasStreak ? `0 0 ${8+streak*4}px ${glowColor}, 0 0 ${20+streak*8}px ${glowColor}44` : "none",
      }}>
      <Art song={song} size={null} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
      <div className="sc-label sc-nope" style={{opacity:leftO}}>NOPE</div>
      <div className="sc-label sc-pick" style={{opacity:rightO}}>PICK</div>
      {/* Streak badge */}
      {hasStreak && <div className="streak-badge">🔥 {streak} streak</div>}
      {/* Upset flash */}
      {showUpset && <div className="upset-flash">🔥 UPSET</div>}
      <div className="sc-info">
        <div className="sc-title">{song.title}</div>
        <div className="sc-artist">{song.artist}</div>
        <div className="sc-meta">{song.album} · {song.year}</div>
        <button className="sc-play" onClick={e=>{e.stopPropagation();e.preventDefault();}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21"/></svg>
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}