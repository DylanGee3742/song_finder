import { useState, useEffect } from "react";
import { mockSongs } from "../../data/mockData";
import { Art } from "../../components/Art";
import { useNavigate } from "react-router-dom";

export function Landing({ onGo }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 60); }, []);

  return (
    <div className={`scr landing ${show ? "in" : ""}`}>
      <div className="l-bg">
        {mockSongs.slice(0, 6).map((s, i) => (
          <div key={s.id} className="l-bg-tile" style={{ "--i": i, animationDelay: `${i * .15}s` }}>
            <Art song={s} size={null} style={{ width: "100%", height: "100%" }} />
          </div>
        ))}
        <div className="l-bg-fade" />
      </div>
      <div className="l-body">
        <div className="l-tag">SONG BATTLES</div>
        <h1 className="l-h1">Find your<br /><em>true favorites.</em></h1>
        <p className="l-p">Swipe through head-to-head matchups.<br />Elo-ranked. Instinct over algorithms.</p>
        {authenticated ? (
          <button onClick={() => navigate("/setup")} className="btn-start">
            Start Battle
          </button>
        ) : (
          <button className="btn-spotify" onClick={() => setAuthenticated(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.6 6.061 20.04 8.4c.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Sign in with Spotify
          </button>
        )}

      </div>
      <div className="l-foot"><span>Spotify API</span><span>No data stored</span><span>Free forever</span></div>
    </div>
  );
}