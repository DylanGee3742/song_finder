import { useState } from "react";

function GhostBattles({ songs, matchedPairs, onResolve }) {
  const [ghosts, setGhosts] = useState(() => {
    const paired = new Set(matchedPairs.map(p => `${Math.min(p[0],p[1])}-${Math.max(p[0],p[1])}`));
    const candidates = [];
    const sorted = [...songs].sort((a,b) => b.elo - a.elo).slice(0, 10);
    for (let i=0; i<sorted.length; i++) {
      for (let j=i+1; j<sorted.length; j++) {
        const key = `${Math.min(sorted[i].id, sorted[j].id)}-${Math.max(sorted[i].id, sorted[j].id)}`;
        if (!paired.has(key)) candidates.push([sorted[i], sorted[j]]);
      }
    }
    return candidates.slice(0,3);
  });
  const [resolved, setResolved] = useState([]);
  const [current, setCurrent] = useState(0);

  if (ghosts.length === 0) return null;
  if (current >= ghosts.length) {
    return (
      <div className="ghost-done">
        <div className="ghost-check">✓</div>
        <p>Ghost battles resolved — rankings refined!</p>
      </div>
    );
  }

  const [a, b] = ghosts[current];

  return (
    <div className="ghost-wrap">
      <div className="ghost-hd">
        <span className="ghost-tag">GHOST BATTLE</span>
        <span className="ghost-ct">{current+1}/{ghosts.length}</span>
      </div>
      <p className="ghost-q">These two never met — who wins?</p>
      <div className="ghost-pair">
        <button className="ghost-card" onClick={() => { onResolve(a.id, b.id); setCurrent(c=>c+1); }}>
          <Art song={a} size={80} borderRadius={12}/>
          <div className="gc-info">
            <span className="gc-t">{a.title}</span>
            <span className="gc-a">{a.artist}</span>
          </div>
        </button>
        <span className="ghost-vs">vs</span>
        <button className="ghost-card" onClick={() => { onResolve(b.id, a.id); setCurrent(c=>c+1); }}>
          <Art song={b} size={80} borderRadius={12}/>
          <div className="gc-info">
            <span className="gc-t">{b.title}</span>
            <span className="gc-a">{b.artist}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
