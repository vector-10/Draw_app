import "./App.css";
import Sketchboard from "./components/Sketchboard";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:4000");
function App() {
  return (
    <div>
      <Sketchboard  socket={socket} />
    </div>
  );
}

export default App;
