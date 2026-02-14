import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODES } from "../../constants/modes";
import { mockSongs } from "../../data/mockData";
import { SwipeCard } from "../../components/SwipeCard";
import { useGameStore } from "../../store/gameStore";

export function Battle() {
  const { gameMode: mode, source } = useGameStore();
  console.log(source)
  const cfg = MODES[mode];
  const maxR = cfg.battles
  const navigate = useNavigate();

  const [round, setRound] = useState(0);
  const [pair, setPair] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const [entering, setEntering] = useState(true); // for entry animation

  // Compute current pair
  useEffect(() => {
    const a = (round * 2) % mockSongs.length;
    const b = (a + 1) % mockSongs.length;
    setPair([a, b]);
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 300);
    return () => clearTimeout(t);
  }, [round]);

  const advance = () => {
    const nextRound = round + 1;
    if (nextRound >= maxR) {
      navigate("/results", { state: { songs: mockSongs, mode } });
      return;
    }
    setRound(nextRound);
  };

  const pct = (round / maxR) * 100;
  const sA = mockSongs[pair[0]];
  const sB = mockSongs[pair[1]];

  return (
    <div className="scr battle">
      <div className="b-hd">
        <span className="b-ct">
          {round + 1}
          <span className="b-dim">/{maxR}</span>
        </span>
        <span className="b-sep">{source.name}</span>
        <span className="b-md">{cfg.label}</span>
      </div>

      <div className="b-bar">
        <div className="b-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="b-zone">
        <div className="b-stack">
          <SwipeCard
            key={`a-${sA.id}-${round}`}
            song={sA}
            side="left"
            entering={entering}
            streak={0}
            isUpset={false}
            onSwipeLeft={advance}   // just go to next round
            onSwipeRight={advance}  // just go to next round
          />
        </div>

        <div className="b-vs">VS</div>

        <div className="b-stack">
          <SwipeCard
            key={`b-${sB.id}-${round}`}
            song={sB}
            side="right"
            entering={entering}
            streak={0}
            isUpset={false}
            onSwipeLeft={advance}
            onSwipeRight={advance}
          />
        </div>
      </div>
    </div>
  );
}
