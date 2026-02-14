import { useState, useEffect } from "react";
import { MODES } from "../../constants/modes";
import { useNavigate } from "react-router-dom";

export function Setup({ onStart }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [src, setSrc] = useState(null);
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(()=>setShow(true), 60); }, []);
  return (
    <div className={`scr setup ${show?"in":""}`}>
      <div className="su-top">
        <div className="su-av">A</div>
        <div><div className="su-name">Alex</div><div className="su-sub">847 liked · 23 playlists</div></div>
      </div>
      <div className="su-sec">
        <div className="su-lbl">MODE</div>
        <div className="mode-row">
          {Object.entries(MODES).map(([k,v]) => (
            <button key={k} className={`mode-c ${mode===k?"on":""}`} onClick={()=>setMode(k)}>
              <span className="mc-name">{v.label}</span>
              <span className="mc-sub">{v.sub} · {v.time}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="su-sec">
        <div className="su-lbl">SOURCE</div>
        <div className="src-col">
          {[{id:"liked",name:"Liked Songs",n:"847 songs"},{id:"workout",name:"Workout Bangers",n:"142 songs"},{id:"chill",name:"Late Night Vibes",n:"89 songs"}].map(s=>(
            <button key={s.id} className={`src-c ${src===s.id?"on":""}`} onClick={()=>setSrc(s.id)}>
              <div className="src-txt"><span className="src-nm">{s.name}</span><span className="src-n">{s.n}</span></div>
              <div className={`src-dot ${src===s.id?"on":""}`}/>
            </button>
          ))}
        </div>
      </div>
      <button className={`btn-begin ${mode&&src?"on":""}`} disabled={!mode||!src} onClick={() => navigate("/battle")}>
        {mode&&src ? `Begin ${MODES[mode].battles} battles` : "Select mode & source"}
      </button>
    </div>
  );
}