import { useState, useEffect, useRef } from "react";

export function SwipeReplay({ history }) {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(-1);
  const timerRef = useRef(null);

  const play = () => {
    setPlaying(true); setIdx(0);
  };
  useEffect(() => {
    if (!playing || idx < 0) return;
    if (idx >= history.length) { setPlaying(false); return; }
    timerRef.current = setTimeout(() => setIdx(i => i+1), 600);
    return () => clearTimeout(timerRef.current);
  }, [playing, idx, history.length]);

  const current = idx >= 0 && idx < history.length ? history[idx] : null;

  return (
    <div className="replay-wrap">
      <div className="replay-hd">
        <span className="replay-tag">SWIPE REPLAY</span>
        {!playing && <button className="replay-btn" onClick={play}>▶ Play</button>}
        {playing && <span className="replay-ct">{idx+1}/{history.length}</span>}
      </div>
      <div className="replay-stage">
        {!playing && !current && (
          <p className="replay-hint">Watch your battle journey unfold</p>
        )}
        {current && (
          <div className={`replay-card ${current.direction}`} key={idx}>
            <div className="rc-pair">
              <div className={`rc-song ${current.winnerId===current.songA.id?"rc-win":"rc-lose"}`}>
                <Art song={current.songA} size={44} borderRadius={8}/>
                <span className="rc-name">{current.songA.title}</span>
              </div>
              <span className="rc-vs">vs</span>
              <div className={`rc-song ${current.winnerId===current.songB.id?"rc-win":"rc-lose"}`}>
                <Art song={current.songB} size={44} borderRadius={8}/>
                <span className="rc-name">{current.songB.title}</span>
              </div>
            </div>
            {current.isUpset && <span className="rc-upset">UPSET</span>}
          </div>
        )}
        {playing && idx >= history.length && (
          <div className="replay-end">
            <span>🏆</span>
            <p>Battle complete!</p>
          </div>
        )}
      </div>
    </div>
  );
}