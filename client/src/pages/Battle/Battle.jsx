import { useState, useEffect, useRef, useCallback } from "react";
import { MODES } from "../../constants/modes";

export function Battle({ mode, onDone }) {
  const cfg = MODES[mode];
  const maxR = Math.min(cfg.battles, 18);
  const [songs, setSongs] = useState(() => SONGS.map(s=>({...s, elo:1500})));
  const [round, setRound] = useState(0);
  const [pair, setPair] = useState([0,1]);
  const [entering, setEntering] = useState(false);
  const [paused, setPaused] = useState(false);
  const [locked, setLocked] = useState(false);

  // Feature state
  const [history, setHistory] = useState([]);       // full battle log
  const [streaks, setStreaks] = useState({});        // songId -> consecutive wins
  const [microStat, setMicroStat] = useState(null); // text shown between rounds
  const [lastUpset, setLastUpset] = useState(null);  // {winnerId, loserId}
  const [undoStack, setUndoStack] = useState([]);    // snapshots for undo
  const [showUndo, setShowUndo] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState([]); // [songIdA, songIdB] pairs
  const undoTimer = useRef(null);

  const getPair = useCallback((list, r) => {
    const sorted = [...list].sort((a,b)=>b.elo-a.elo);
    const i = (r*2)%list.length, j = (r*2+1)%list.length;
    return [list.findIndex(s=>s.id===sorted[i]?.id), list.findIndex(s=>s.id===sorted[j]?.id)];
  }, []);

  useEffect(() => { setPair(getPair(songs, 0)); }, []);

  // Generate micro-stat from history
  const genMicroStat = useCallback((hist) => {
    if (hist.length < 2) return null;
    const genreWins = {};
    hist.forEach(h => { const w = SONGS.find(s=>s.id===h.winnerId); if(w) genreWins[w.genre]=(genreWins[w.genre]||0)+1; });
    const topGenre = Object.entries(genreWins).sort((a,b)=>b[1]-a[1])[0];
    const artistWins = {};
    hist.forEach(h => { const w = SONGS.find(s=>s.id===h.winnerId); if(w) artistWins[w.artist]=(artistWins[w.artist]||0)+1; });
    const topArtist = Object.entries(artistWins).sort((a,b)=>b[1]-a[1])[0];
    const stats = [
      topGenre ? `${topGenre[0]}: ${topGenre[1]} wins` : null,
      topArtist?.[1] >= 2 ? `${topArtist[0]} is dominating` : null,
      hist.length >= 5 ? `${hist.filter(h=>h.isUpset).length} upsets so far` : null,
    ].filter(Boolean);
    return stats[Math.floor(Math.random()*stats.length)] || null;
  }, []);

  const advance = useCallback((winnerId) => {
    if (locked) return;
    setLocked(true);

    const wI = songs.findIndex(s=>s.id===winnerId);
    const lI = pair[0]===wI ? pair[1] : pair[0];
    const winner = songs[wI], loser = songs[lI];
    const isUpset = winner.elo < loser.elo - 50;
    const r = eloCalc(winner.elo, loser.elo);

    // Save undo snapshot
    setUndoStack(prev => [...prev, { songs: songs.map(s=>({...s})), round, pair: [...pair], history: [...history], streaks: {...streaks}, matchedPairs: [...matchedPairs] }]);
    setShowUndo(true);
    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(()=>setShowUndo(false), 3500);

    // Update streaks
    const newStreaks = { ...streaks };
    newStreaks[winnerId] = (newStreaks[winnerId]||0)+1;
    newStreaks[loser.id] = 0;
    setStreaks(newStreaks);

    // Record battle
    const battleRecord = {
      songA: winner, songB: loser, winnerId, loserId: loser.id,
      direction: wI===pair[0] ? "left-wins" : "right-wins", isUpset,
    };
    const newHistory = [...history, battleRecord];
    setHistory(newHistory);
    setMatchedPairs(prev => [...prev, [winner.id, loser.id]]);

    if (isUpset) setLastUpset({ winnerId, loserId: loser.id });
    else setLastUpset(null);

    // Micro-stat
    const stat = genMicroStat(newHistory);
    setMicroStat(stat);

    const ns = [...songs];
    ns[wI] = {...ns[wI], elo: r.w};
    ns[lI] = {...ns[lI], elo: r.l};

    setTimeout(() => {
      setSongs(ns);
      const nr = round+1;
      if (nr >= maxR) {
        onDone({ songs: [...ns].sort((a,b)=>b.elo-a.elo), history: newHistory, matchedPairs: [...matchedPairs, [winner.id, loser.id]] });
        return;
      }
      setRound(nr);
      setPair(getPair(ns, nr));
      setEntering(true);
      setTimeout(() => { setEntering(false); setLocked(false); setTimeout(()=>setMicroStat(null), 1500); }, 500);
    }, 300);
  }, [locked, songs, pair, round, maxR, getPair, onDone, history, streaks, matchedPairs, genMicroStat]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const snap = undoStack[undoStack.length - 1];
    setSongs(snap.songs);
    setRound(snap.round);
    setPair(snap.pair);
    setHistory(snap.history);
    setStreaks(snap.streaks);
    setMatchedPairs(snap.matchedPairs);
    setUndoStack(prev => prev.slice(0, -1));
    setShowUndo(false);
    setLocked(false);
    setEntering(false);
    setMicroStat(null);
    setLastUpset(null);
  }, [undoStack]);

  const pct = (round/maxR)*100;
  const sA = songs[pair[0]], sB = songs[pair[1]];

  if (paused) return (
    <div className="scr pause-scr">
      <div className="pa-box">
        <div className="pa-ic">❚❚</div><div className="pa-t">Paused</div>
        <div className="pa-s">{round}/{maxR} complete</div>
        <div className="pa-bar"><div className="pa-fill" style={{width:`${pct}%`}}/></div>
        <button className="btn-resume" onClick={()=>setPaused(false)}>Resume</button>
      </div>
    </div>
  );

  return (
    <div className="scr battle">
      <div className="b-hd">
        <button className="b-btn" onClick={()=>setPaused(true)}>❚❚</button>
        <span className="b-ct">{round+1}<span className="b-dim">/{maxR}</span></span>
        <div className="b-hd-right">
          {showUndo && undoStack.length > 0 && (
            <button className="undo-btn" onClick={undo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              Undo
            </button>
          )}
          <span className="b-md">{cfg.label}</span>
        </div>
      </div>
      <div className="b-bar"><div className="b-fill" style={{width:`${pct}%`}}/></div>

      {/* Micro-stat flash */}
      <div className={`micro-stat ${microStat?"show":""}`}>
        {microStat && <span>{microStat}</span>}
      </div>

      <div className="b-zone">
        <div className="b-stack">
          <SwipeCard key={`a-${sA.id}-${round}`} song={sA} side="left" entering={entering}
            streak={streaks[sA.id]||0} isUpset={lastUpset?.winnerId===sA.id}
            onSwipeRight={()=>advance(sA.id)} onSwipeLeft={()=>advance(sB.id)}/>
        </div>
        <div className="b-vs">VS</div>
        <div className="b-stack">
          <SwipeCard key={`b-${sB.id}-${round}`} song={sB} side="right" entering={entering}
            streak={streaks[sB.id]||0} isUpset={lastUpset?.winnerId===sB.id}
            onSwipeRight={()=>advance(sB.id)} onSwipeLeft={()=>advance(sA.id)}/>
        </div>
      </div>

      <div className="b-taps">
        <button className="b-tap" onClick={()=>!locked&&advance(sA.id)}>
          <span className="bt-song">{sA.title}</span><span className="bt-cta">Pick</span>
        </button>
        <button className="b-skip" onClick={()=>!locked&&advance(Math.random()>.5?sA.id:sB.id)}>Skip</button>
        <button className="b-tap" onClick={()=>!locked&&advance(sB.id)}>
          <span className="bt-song">{sB.title}</span><span className="bt-cta">Pick</span>
        </button>
      </div>
    </div>
  );
}
