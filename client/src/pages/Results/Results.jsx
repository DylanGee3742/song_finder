import { useState, useEffect} from "react";

export function Results({ data, mode, onRestart }) {
  const { songs: ranked, history, matchedPairs } = data;
  const [show, setShow] = useState(false);
  const [exp, setExp] = useState(0);
  const [tab, setTab] = useState("rankings");
  const cfg = MODES[mode];
  const top = ranked.slice(0, Math.min(cfg.topN, ranked.length));

  useEffect(() => { setTimeout(()=>setShow(true), 80); }, []);

  const genres={}, decades={}, artists={};
  top.forEach(s => {
    genres[s.genre]=(genres[s.genre]||0)+1;
    decades[Math.floor(s.year/10)*10+"s"]=(decades[Math.floor(s.year/10)*10+"s"]||0)+1;
    artists[s.artist]=(artists[s.artist]||0)+1;
  });
  const tg = Object.entries(genres).sort((a,b)=>b[1]-a[1])[0];
  const td = Object.entries(decades).sort((a,b)=>b[1]-a[1])[0];
  const ta = Object.entries(artists).sort((a,b)=>b[1]-a[1])[0];
  const upsets = history.filter(h=>h.isUpset);

  const handleGhostResolve = (winnerId, loserId) => {
    // Could update Elo in a real app — here just visual
  };

  return (
    <div className={`scr results ${show?"in":""}`}>
      <div className="conf-box">
        {Array.from({length:45}).map((_,i)=>(
          <div key={i} className="cnf" style={{
            left:`${Math.random()*100}%`, "--dl":`${Math.random()*2.5}s`,
            "--dr":`${2.5+Math.random()*2}s`, "--hu":Math.random()*360,
            "--rt":`${Math.random()*720}deg`,
            width:`${3+Math.random()*5}px`, height:`${8+Math.random()*12}px`,
          }}/>
        ))}
      </div>

      <div className="r-top">
        <div className="r-tag">YOUR RESULTS</div>
        <h1 className="r-h1">Top {top.length}</h1>
        <p className="r-sub">{history.length} battles · {upsets.length} upsets</p>
      </div>

      {/* #1 Spotlight */}
      <div className="spot">
        <Art song={top[0]} size={null} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} borderRadius={20}/>
        <div className="spot-over">
          <div className="spot-rank">#1</div>
          <h2 className="spot-t">{top[0]?.title}</h2>
          <p className="spot-a">{top[0]?.artist}</p>
          <p className="spot-m">{top[0]?.album} · {top[0]?.year}</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="st-row">
        {[
          {l:"Genre",v:tg?.[0],d:`${Math.round((tg?.[1]/top.length)*100)}%`},
          {l:"Decade",v:td?.[0],d:`${td?.[1]} songs`},
          {l:"Artist",v:ta?.[0],d:`${ta?.[1]} in top ${top.length}`},
        ].map((s,i)=>(
          <div key={i} className="st-card"><span className="st-v">{s.v}</span><span className="st-l">{s.l}</span><span className="st-d">{s.d}</span></div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="tabs">
        {["rankings","dna","replay","ghosts"].map(t=>(
          <button key={t} className={`tab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>
            {t==="rankings"?"Rankings":t==="dna"?"Taste DNA":t==="replay"?"Replay":t==="ghosts"?"Ghost Battles":""}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab==="rankings" && (
        <div className="rk">
          {top.map((s,i) => (
            <div key={s.id} className="rk-row" style={{"--dl":`${.2+i*.04}s`}}>
              <span className={`rk-n ${i<3?"gld":""}`}>
                {i===0?"🥇":i===1?"🥈":i===2?"🥉":String(i+1).padStart(2,"0")}
              </span>
              <div className="rk-art"><Art song={s} size={40} borderRadius={6}/></div>
              <div className="rk-inf">
                <span className="rk-t">{s.title}</span>
                <span className="rk-a">{s.artist}</span>
              </div>
              <span className="rk-e">{Math.round(s.elo)}</span>
            </div>
          ))}
        </div>
      )}

      {tab==="dna" && <TasteDNA songs={top}/>}
      {tab==="replay" && <SwipeReplay history={history}/>}
      {tab==="ghosts" && <GhostBattles songs={ranked} matchedPairs={matchedPairs} onResolve={handleGhostResolve}/>}

      {/* Export */}
      <div className="ex">
        {exp===0 && <>
          <button className="btn-ex" onClick={()=>{setExp(1);setTimeout(()=>setExp(2),1800);}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.6 6.061 20.04 8.4c.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            Create Spotify Playlist
          </button>
          <button className="btn-sh">Share Results</button>
        </>}
        {exp===1 && <div className="ex-ld"><div className="ex-sp"/><p>Creating playlist…</p></div>}
        {exp===2 && <div className="ex-ok">
          <div className="ex-ck">✓</div>
          <div className="ex-dt">Playlist Created</div>
          <div className="ex-ds">My Top {top.length} — Feb 2026</div>
          <button className="btn-open">Open in Spotify</button>
        </div>}
      </div>
      <button className="btn-re" onClick={onRestart}>Battle Again</button>
    </div>
  );
}