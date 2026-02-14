import { useState, useEffect } from "react";

export function Results() {
  // Mock results
  const ranked = [
    { id: 1, title: "Song A", artist: "Artist 1" },
    { id: 2, title: "Song B", artist: "Artist 2" },
    { id: 3, title: "Song C", artist: "Artist 3" },
    { id: 4, title: "Song D", artist: "Artist 4" },
    { id: 5, title: "Song E", artist: "Artist 5" },
  ];

  const [show, setShow] = useState(false);
  const [tab, setTab] = useState("rankings");
  const [exp, setExp] = useState(0);

  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);

  const top = ranked.slice(0, 5); // just show top 5 for simplicity

  const onRestart = () => {
    alert("Restart battle clicked!");
  };

  return (
    <div className={`scr results ${show ? "in" : ""}`}>
      <div className="r-top">
        <div className="r-tag">YOUR RESULTS</div>
        <h1 className="r-h1">Top {top.length}</h1>
      </div>

      {/* Simple top 1 spotlight */}
      {top[0] && (
        <div className="spot">
          <div className="spot-over">
            <div className="spot-rank">#1</div>
            <h2 className="spot-t">{top[0].title}</h2>
            <p className="spot-a">{top[0].artist}</p>
          </div>
        </div>
      )}

      {/* Tab navigation */}
      <div className="tabs">
        {["rankings","dna","replay","ghosts"].map(t => (
          <button key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>
            {t === "rankings" ? "Rankings" : t === "dna" ? "Taste DNA" : t === "replay" ? "Replay" : t === "ghosts" ? "Ghost Battles" : ""}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "rankings" && (
        <div className="rk">
          {top.map((s, i) => (
            <div key={s.id} className="rk-row">
              <span className="rk-n">{i + 1}</span>
              <span className="rk-t">{s.title}</span>
              <span className="rk-a">{s.artist}</span>
            </div>
          ))}
        </div>
      )}

      {/* Simple export buttons */}
      <div className="ex">
        {exp === 0 && (
          <>
            <button className="btn-ex" onClick={() => { setExp(1); setTimeout(() => setExp(2), 1800); }}>
              Create Playlist
            </button>
            <button className="btn-sh">Share Results</button>
          </>
        )}
        {exp === 1 && <div className="ex-ld"><p>Creating playlist…</p></div>}
        {exp === 2 && <div className="ex-ok">
          <p>Playlist Created</p>
          <button className="btn-open">Open in Spotify</button>
        </div>}
      </div>

      <button className="btn-re" onClick={onRestart}>Battle Again</button>
    </div>
  );
}
