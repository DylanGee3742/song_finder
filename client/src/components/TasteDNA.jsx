export function TasteDNA({ songs }) {
  const genres = {}, decades = {};
  let totalEnergy = 0;
  songs.forEach(s => {
    genres[s.genre] = (genres[s.genre]||0)+1;
    decades[Math.floor(s.year/10)*10+"s"] = (decades[Math.floor(s.year/10)*10+"s"]||0)+1;
    totalEnergy += (s.energy||.5);
  });
  const avgEnergy = totalEnergy / songs.length;
  const genreKeys = Object.keys(genres).slice(0,6);
  const maxG = Math.max(...Object.values(genres));
  const decadeKeys = Object.keys(decades).sort();

  const cx=120, cy=120, r=80;
  const axes = [...genreKeys];
  const n = axes.length;
  if (n < 3) return null;

  const points = axes.map((a, i) => {
    const angle = (Math.PI*2*i/n) - Math.PI/2;
    const val = (genres[a]||0)/maxG;
    return {
      x: cx + r*val*Math.cos(angle),
      y: cy + r*val*Math.sin(angle),
      lx: cx + (r+20)*Math.cos(angle),
      ly: cy + (r+20)*Math.sin(angle),
      label: a, val,
    };
  });
  const poly = points.map(p=>`${p.x},${p.y}`).join(" ");
  const grid = [.25,.5,.75,1].map(s => ({
    pts: axes.map((_,i) => {
      const angle = (Math.PI*2*i/n)-Math.PI/2;
      return `${cx+r*s*Math.cos(angle)},${cy+r*s*Math.sin(angle)}`;
    }).join(" ")
  }));

  return (
    <div className="dna-wrap">
      <div className="dna-title">Taste DNA</div>
      <svg viewBox="0 0 240 240" className="dna-svg">
        {grid.map((g,i) => <polygon key={i} points={g.pts} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1"/>)}
        {axes.map((_,i) => {
          const angle=(Math.PI*2*i/n)-Math.PI/2;
          return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(angle)} y2={cy+r*Math.sin(angle)} stroke="rgba(255,255,255,.06)" strokeWidth="1"/>;
        })}
        <polygon points={poly} fill="rgba(255,77,77,.15)" stroke="#ff4d4d" strokeWidth="1.5" className="dna-shape"/>
        {points.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#ff4d4d"/>)}
        {points.map((p,i) => (
          <text key={i} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle"
            style={{fontSize:8,fill:"rgba(255,255,255,.4)",fontFamily:"var(--fb)",fontWeight:600}}>{p.label}</text>
        ))}
      </svg>
      <div className="dna-stats">
        <div className="dna-st">
          <div className="dna-bar-wrap">
            <div className="dna-bar-fill" style={{width:`${avgEnergy*100}%`}}/>
          </div>
          <span className="dna-st-l">Energy: {Math.round(avgEnergy*100)}%</span>
        </div>
        <div className="dna-st">
          <div className="dna-bar-wrap">
            <div className="dna-bar-fill dna-bar-alt" style={{width:`${(genreKeys.length/6)*100}%`}}/>
          </div>
          <span className="dna-st-l">Diversity: {genreKeys.length} genres</span>
        </div>
        <div className="dna-decades">
          {decadeKeys.map(d => (
            <span key={d} className="dna-dec">{d} <em>{decades[d]}</em></span>
          ))}
        </div>
      </div>
    </div>
  );
}