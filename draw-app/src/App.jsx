import "./App.css";
import Sketchboard from "./components/Sketchboard";
import { io } from "socket.io-client";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

const socket = io.connect("http://localhost:4000");
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/sketch" element={<Sketchboard socket={socket} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
