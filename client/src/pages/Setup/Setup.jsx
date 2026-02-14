import { useState, useEffect } from "react";
import { MODES } from "../../constants/modes";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";
import { mockSources } from "../../data/mockData";

export function Setup({ onStart }) {
  const navigate = useNavigate();
  const { setMode, setSource, gameMode, source } = useGameStore();
  const [show, setShow] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 60); }, []);
  return (
    <div className={`scr setup ${show ? "in" : ""}`}>
      <div className="su-top">
        <div className="su-av">A</div>
        <div><div className="su-name">Alex</div><div className="su-sub">847 liked · 23 playlists</div></div>
      </div>
      <div className="su-sec">
        <div className="su-lbl">MODE</div>
        <div className="mode-row">
          {Object.entries(MODES).map(([k, v]) => (
            <button key={k} className={`mode-c ${gameMode === k ? "on" : ""}`} onClick={() => setMode(k)}>
              <span className="mc-name">{v.label}</span>
              <span className="mc-sub">{v.sub} · {v.time}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="su-sec">
        <div className="su-lbl">SOURCE</div>
        <div className="src-col">
          {mockSources.map(s => (
            <button
              key={s.id}
              className={`src-c ${source?.id === s.id ? "on" : ""}`}
              onClick={() => setSource(s)}
            >
              <div className="src-txt">
                <span className="src-nm">{s.name}</span>
                <span className="src-n">{s.n}</span>
              </div>
              {/* This dot indicates the selected source */}
              <div className={`src-dot ${source?.id === s.id ? "on" : ""}`} />
            </button>
          ))}
        </div>
      </div>
      <button className={`btn-begin ${gameMode && source ? "on" : ""}`} disabled={!gameMode || !source} onClick={() => navigate("/battle")}>
        {gameMode && source ? `Begin ${MODES[gameMode].battles} battles` : "Select mode & source"}
      </button>
    </div>
  );
}