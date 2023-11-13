import { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm.js";

const Sketchboard = () => {
  //First we create a roughjs generator instance
  const generator = rough.generator();
  //set state for elements and sketching to an empty array and value fo false to be later changed
  const [elements, setElements] = useState([]);
  const [sketching, setSketching] = useState(false);
  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState()
  //create a state for tool and set it to line tool  by default
  const [tool, setTool] = useState("line");
  // The useLayoutEffect is resposible for rendering drawing elements
  useLayoutEffect(() => {
    // Working wiht the DOM API to get the canvas by ID
    const canvas = document.getElementById("canvas");
    //To specify that the context of our drawings is 2-dimensional
    const context = canvas.getContext("2d");

    // create a roughjs instance associated with the canvas element
    const roughCanvas = rough.canvas(canvas);
    // set the stroke style and line width for the canvas context
    context.strokeStyle = "black";
    context.lineWidth = 5;
    //clear the entire canvas to make it plain
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (elements && elements.length > 0) {
      elements.forEach(({ roughElement }) => {
        roughCanvas.draw(roughElement);
      });
    }
  }, [elements]);

  const createElement = (x1, y1, x2, y2) => {
    let roughElement;
    if (tool === "line") {
      roughElement = generator.line(x1, y1, x2, y2);
    } else if (tool === "rectangle") {
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    }
    return { x1, y1, x2, y2, roughElement };
  };

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
  // Event handler for mouse down, here we set sketching to true
  const handleMouseDown = (e) => {
    setSketching(true);
    const { clientX, clientY } = e;
    //create a new draing element when mouse down is detected
    const element = createElement(clientX, clientY, clientX, clientY);
    setElements((prevState) => [...prevState, element]);
  };

  // Evenet handler for a moving mouse on the drawing canvas
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
     // ... (code for drawing)
    } else if (action === "moving") {
     // If in "moving" action (dragging an element)
     const { id, x1, x2, y1, y2, elementType, offsetX, offsetY } =
      selectedElement;
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
      elementType,
     );
     const elementsCopy = [...elements];
     elementsCopy[id] = UpdatedElement;
     setElements(elementsCopy);
    }
   };
  //Event handler for mouse up, here we set sketching to false
  const handleMouseUp = () => {
    setSketching(false);
  };
  // Return JSX to render the collaborative canvas for sketching
  return (
    <>
      <div className="d-flex col-md-2 justify-content-center gap-1">
        <div className="d-flex gap-1 align-items-center">
          <input
            type="radio"
            id="selection"
            checked={tool === "selection"}
            onChange={() => setTool("selection")}
          />
          <label htmlFor="selection">Drag n Drop</label>
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

export default Sketchboard;
