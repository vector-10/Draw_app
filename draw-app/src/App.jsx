import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Header from "./components/Header";
import Sketchboard from "./components/Sketchboard";


function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/sketch" element={<Sketchboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/header" element={<Header />} />
      </Routes>
    </div>
  );
}

export default App;
