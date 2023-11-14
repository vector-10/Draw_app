import "./App.css";
import Sketchboard from "./components/Sketchboard";
import { io } from "socket.io-client";
// url origin for the socket server
const socket = io.connect('http://localhost:4000');

function App() {
  return (
    <div>
      <Sketchboard />
    </div>
  );
}

export default App;
