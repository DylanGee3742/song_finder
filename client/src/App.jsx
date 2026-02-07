import { useState } from "react";
import './styles.css'
/* ════════════════════════════════════════
   APP
   ════════════════════════════════════════ */
export default function App() {
  const [v, setV] = useState("landing");
  const [mode, setMode] = useState("standard");
  const [resultData, setResultData] = useState(null);

  return (
    <div className="shell">
      {v==="landing" && <Landing onGo={()=>setV("setup")}/>}
      {v==="setup" && <Setup onStart={m=>{setMode(m);setV("battle")}}/>}
      {v==="battle" && <Battle mode={mode} onDone={d=>{setResultData(d);setV("results")}}/>}
      {v==="results" && resultData && <Results data={resultData} mode={mode} onRestart={()=>{setResultData(null);setV("landing")}}/>}
    </div>
  );
}
