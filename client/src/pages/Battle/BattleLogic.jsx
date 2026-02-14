import { useState, useEffect } from "react";
import { MODES } from "../../constants/modes";
import { mockSongs } from "../../data/mockData";

export function Battle({ mode, onDone }) {
  const cfg = MODES[mode];
  const maxR = Math.min(cfg.battles, 18);

  const [round, setRound] = useState(0);
  const [pair, setPair] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  // Simple pair progression (just moves forward through array)
  useEffect(() => {
    const a = (round * 2) % mockSongs.length;
    const b = (a + 1) % mockSongs.length;
    setPair([a, b]);
  }, [round]);

  const advance = () => {
    const nextRound = round + 1;

    if (nextRound >= maxR) {
      onDone({ songs: mockSongs });
      return;
    }

    setRound(nextRound);
  };

  const pct = (round / maxR) * 100;
  const sA = mockSongs[pair[0]];
  const sB = mockSongs[pair[1]];

  if (paused) {
    return (
      <div className="scr pause-scr">
        <div className="pa-box">
          <div className="pa-ic">❚❚</div>
          <div className="pa-t">Paused</div>
          <div className="pa-s">
            {round}/{maxR} complete
          </div>
          <div className="pa-bar">
            <div className="pa-fill" style={{ width: `${pct}%` }} />
          </div>
          <button className="btn-resume" onClick={() => setPaused(false)}>
            Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scr battle">
      <div className="b-hd">
        <button className="b-btn" onClick={() => setPaused(true)}>
          ❚❚
        </button>
        <span className="b-ct">
          {round + 1}
          <span className="b-dim">/{maxR}</span>
        </span>
        <span className="b-md">{cfg.label}</span>
      </div>

      <div className="b-bar">
        <div className="b-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="b-zone">
        <div className="b-card">
          <h3>{sA.title}</h3>
          <p>{sA.artist}</p>
        </div>

        <div className="b-vs">VS</div>

        <div className="b-card">
          <h3>{sB.title}</h3>
          <p>{sB.artist}</p>
        </div>
      </div>

      <div className="b-taps">
        <button className="b-tap" onClick={advance}>
          <span className="bt-song">{sA.title}</span>
          <span className="bt-cta">Pick</span>
        </button>

        <button className="b-skip" onClick={advance}>
          Skip
        </button>

        <button className="b-tap" onClick={advance}>
          <span className="bt-song">{sB.title}</span>
          <span className="bt-cta">Pick</span>
        </button>
      </div>
    </div>
  );
}
