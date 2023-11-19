import "./App.css";
import Sketchboard  from "../src/components/Sketchboard";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";


function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/sketch" element={<Sketchboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
