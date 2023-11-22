import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Board from "./components/Board";



function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/sketch" element={<Board />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
