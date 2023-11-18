/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import rough from "roughjs/bundled/rough.esm.js";
import PropTypes from "prop-types";

// Create a RoughJS generator instance
const generator = rough.generator();

// Board Component: Handles collaborative drawing on canvas
const Board = ({socket}) => {

  // State for managing drawing elements and interactions
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState(null);

  // UseLayoutEffect: Responsible for rendering drawing elements
  useLayoutEffect(() => {
    // Get the canvas element by its ID
    const canvas = document.getElementById("canvas");

    // Get the 2D rendering context of the canvas
    const ctx = canvas.getContext("2d");

    // Create a RoughJS canvas instance associated with the canvas element
    const roughCanvas = rough.canvas(canvas);

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

  // Function to create a new drawing element
  const createElement = (id, x1, y1, x2, y2, elementType) => {
    let roughElement;
    // Use the RoughJS generator to create a rough element (line or rectangle)
    if (elementType === "line") {
      roughElement = generator.line(x1, y1, x2, y2);
    } else if (elementType === "rect") {
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    // Return an object representing the element, including its coordinates and RoughJS representation
    return { id, elementType, x1, y1, x2, y2, roughElement };
  };

  const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  const getElementAtPosition = (x, y) => {
    return elements.find((element) => {
      const { elementType, x1, y1, x2, y2 } = element;
      if (elementType === "rect") {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      } else {
        const a = { x: x1, y: y1 };
        const b = { x: x2, y: y2 };
        const c = { x, y };
        const offset = distance(a, b) - (distance(a, c) + distance(b, c));
        return Math.abs(offset) < 1;
      }
    });
  };

  // Event handler for mouse down
  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        setAction("moving");
      }
    } else {
      const { clientX, clientY } = e;
      const id = elements.length;
      // Create a new drawing element when mouse down is detected
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
        socket.id
      );
      console.log("Drawing data emmitted", {element, ID:socket.id});
      setElements((prevState) => [...prevState, element]);
      setAction("drawing");
      socket.emit('draw', element);
      
    }
  };

  const updateElement = (id, x1, y1, x2, y2, tool) => {
    const UpdatedElement = createElement(id, x1, y1, x2, y2, tool);

    const elementsCopy = [...elements];
    elementsCopy[id] = UpdatedElement;
    setElements(elementsCopy);
  };

  // Event handler for mouse move
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    if (tool === "selection") {
      e.target.style.cursor = getElementAtPosition(clientX, clientY, elements)
        ? "move"
        : "default";
    }

    if (action === "drawing") {
      // Find the index of the last element created during mouse down
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      // Update the element's coordinates for dynamic drawing
      updateElement(index, x1, y1, clientX, clientY, tool);

      socket.emit("draw", elements[index]);
    } else if (action === "moving") {
      const { id, x1, x2, y1, y2, elementType, offsetX, offsetY } =
        selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      updateElement(id, newX, newY, newX + width, newY + height, elementType);
      // Emit the draw event to the server
      socket.emit("draw", selectedElement);
    }
  };


// Listen for the 'draw' event from the server to update the drawing
useEffect(() => {
  socket.on("draw", (data) => {
    // Log the drawing data received on the client side
    console.log("Drawing data received on client:", data);

    // Check if the senderSocketId matches the current client's socket ID
    const isLocalDraw = data.senderSocketId === socket.id;

    // Update the drawing only if it's not from the current client
    if (!isLocalDraw) {
      setElements([ data]);
    }
  });

  return () => {
    socket.off("draw");
  };
}, [socket]);



  // Event handler for mouse up
  const handleMouseUp = () => {
    setAction("none");
    setSelectedElement(null);
  };

  // Return JSX to render the collaborative canvas
  return (
    <>
      <div>
        <div style={{ position: "fixed", zIndex: 2 }}>
          <input
            type="radio"
            id="selection"
            checked={tool === "selection"}
            onChange={() => setTool("selection")}
          />
          <label htmlFor="selection">Drag n Drop</label>
          <input
            type="radio"
            id="line"
            checked={tool === "line"}
            onChange={() => setTool("line")}
          />
          <label htmlFor="line">Line</label>
          <input
            type="radio"
            id="rectangle"
            checked={tool === "rect"}
            onChange={() => setTool("rect")}
          />
          <label htmlFor="rectangle">Rectangle</label>
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

Board.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func.isRequired,
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
  }),
};


export default Board;
