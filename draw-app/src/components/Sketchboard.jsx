import { useState, useLayoutEffect, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm.js";
import PropTypes from "prop-types";
import {io} from "socket.io-client";

const WhiteBoard = () => {
  // State for managing drawing elements and interactions
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [action, setAction] = useState("");
  const [tool, setTool] = useState("line");
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    // Define the server URL
    const server = "http://localhost:4000";
    // Configuration options for the socket connection
    const connectionParameters = {
     "force new connection": true,
     reconnectionAttempts: "Infinity",
     timeout: 10000,
     transports: ["websocket"],
    };
    // Establish a new socket connection
    const newSocketConnection = io(server, connectionParameters);
    setSocket(newSocketConnection);
    // Event listener for successful connection
    newSocketConnection.on("connect", () => {
     console.log("Connected to newSocket.io server!");
    });
    // Event listener for receiving served elements from the server
    newSocketConnection.on("servedElements", (elementsCopy) => {
     setElements(elementsCopy.elements);
    });
    // Clean up the socket connection when the component is unmounted
    return () => {
     newSocketConnection.disconnect();
    };
   }, []);

  // Create a RoughJS generator instance
  const generator = rough.generator();
  // UseLayoutEffect: Responsible for rendering drawing elements
  useLayoutEffect(() => {
    // Get the canvas element by its ID
    const canvas = document.getElementById("canvas");
    // Get the 2D rendering context of the canvas
    const ctx = canvas.getContext("2d");
    // Create a RoughJS canvas instance associated with the canvas element
    const roughCanvas = rough.canvas(canvas);
    // Set stroke style and line width for the canvas context
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    // Clear the entire canvas to ensure a clean drawing surface
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // If there are saved elements to render
    if (elements && elements.length > 0) {
      // Iterate through each saved element
      elements.forEach(({ roughElement }) => {
        // Use RoughJS to draw the element on the canvas
        roughCanvas.draw(roughElement);
      });
    }
  }, [elements]);

  const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  const getElementAtPosition = (x, y) => {
    // Iterate through each element in the 'elements' array
    return elements.find((element) => {
      const { elementType, x1, y1, x2, y2 } = element;
      // Depending on the element type (line or rectangle), perform checks
      if (elementType === "rectangle") {
        // Check if the cursor position (x, y) falls within the boundaries of the rectangle
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      } else {
        // Check if the cursor is close enough to the line using a mathematical offset
        const a = { x: x1, y: y1 };
        const b = { x: x2, y: y2 };
        const c = { x, y };
        const offset = distance(a, b) - (distance(a, c) + distance(b, c));
        return Math.abs(offset) < 1;
      }
    });
  };

  // Function to create a new drawing element
  const createElement = (x1, y1, x2, y2) => {
    let roughElement;
    // Use the RoughJS generator to create a rough element (line or rectangle)
    if (tool === "line") {
      roughElement = generator.line(x1, y1, x2, y2);
    } else if (tool === "rectangle") {
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    }
    // Return an object representing the element, including its coordinates and RoughJS representation
    return { x1, y1, x2, y2, roughElement };
  };
  // Event handler for mouse down
  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    // Check if the current tool is "Selection"
    if (tool === "selection") {
      // Find the element at the clicked position
      const element = getElementAtPosition(clientX, clientY);
      // If an element is found
      if (element) {
        // Calculate the offset from the top-left corner of the element
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        // Store the selected element along with the offset
        setSelectedElement({ ...element, offsetX, offsetY });
        // Set the action to "moving" to indicate that dragging is in progress
        setAction("moving");
      }
    } else {
      setAction("drawing");
      const { clientX, clientY } = e;
      // Create a new drawing element when mouse down is detected
      const element = createElement(clientX, clientY, clientX, clientY);
      setElements((prevState) => [...prevState, element]);
      socket.emit("startDrawing", element);
    }
  };
  // Event handler for mouse move
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Check if the current tool is "Selection"
    if (tool === "selection") {
      // Determine cursor style based on whether the mouse is over an element
      e.target.style.cursor = getElementAtPosition(clientX, clientY, elements)
        ? "move"
        : "default";
    }

    // Check the current action
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      // Update the element's coordinates for dynamic drawing
      const updatedElement = createElement(x1, y1, clientX, clientY);
      const elementsCopy = [...elements];
      elementsCopy[index] = updatedElement;
      setElements(elementsCopy);
    } else if (action === "moving") {
      // If in "moving" action (dragging an element)
      const { id, x1, x2, y1, y2, elementType, offsetX, offsetY } =
        selectedElement || {};
      const width = x2 - x1;
      const height = y2 - y1;
      // Calculate the new position of the dragged element
      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      // Update the element's coordinates to perform dragging
      const UpdatedElement = createElement(
        id,
        newX,
        newY,
        newX + width,
        newY + height,
        elementType
      );
      const elementsCopy = [...elements];
      elementsCopy[id] = UpdatedElement;
      setElements(elementsCopy);
    }
  };

  // Event handler for mouse up
  const handleMouseUp = () => {
    setAction(false);
  };
  // Return JSX to render the collaborative canvas
  return (
    <>
      <div className="d-flex col-md-2 justify-content-center gap-1">
        <div className="d-flex gap-1 align-items-center">
          <label htmlFor="selection">Drag n Drop</label>
          <input
            type="radio"
            id="selection"
            checked={tool === "selection"}
            onChange={() => setTool("selection")}
          />

          <label htmlFor="line">Line</label>
          <input
            type="radio"
            id="line"
            name="tool"
            value="line"
            checked={tool === "line"}
            className="mt-1"
            onChange={(e) => setTool(e.target.value)}
          />
        </div>
        <div className="d-flex gap-1 align-items-center">
          <label htmlFor="rectangle">Rectangle</label>
          <input
            type="radio"
            name="tool"
            id="rectangle"
            checked={tool === "rectangle"}
            value="rectangle"
            className="mt-1"
            onChange={(e) => setTool(e.target.value)}
          />
        </div>
      </div>
      <canvas
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </>
  );
};

WhiteBoard.propTypes = {
  socket: PropTypes.object.isRequired,
  emit:PropTypes.object};

export default WhiteBoard;
