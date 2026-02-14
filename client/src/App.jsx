import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles.css'
import { Landing } from "./pages/Landing/Landing";
import { Setup } from "./pages/Setup/Setup";
import { Battle } from "./pages/Battle/Battle";
import { Results } from "./pages/Results/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/setup' element={<Setup />} />
        <Route path='/battle' element={<Battle />} />
        <Route path='/results' element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
};
