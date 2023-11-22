import "./App.css";
import { Routes, Route } from "react-router-dom";
import Board from "./components/Board";



function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Board />} />
      </Routes>
    </div>
  );
}

export default App;
