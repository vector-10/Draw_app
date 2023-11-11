import { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm.js";

const Sketchboard = () => {
  const generator = rough.generator();
  const [elements, setElements] = useState([]);
  const [sketching, setSketching] = useState(false);
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    const roughCanvas = rough.canvas(canvas);
    context.strokeStyle = "black";
    context.lineWidth = 5;

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (elements && elements.length > 0) {
      elements.forEach(({ roughElement }) => {
        roughCanvas.draw(roughElement);
      });
    }
  }, [elements]);

  const createElement = (x1, y1, x2, y2) => {
    const roughElement = generator.line(x1, y1, x2, y2);

    return { x1, y1, x2, y2, roughElement };
  };

  const handleMouseDown = (e) => {
    setSketching(true);

    const { clientX, clientY } = e;

    const element = createElement(clientX, clientY, clientX, clientY);
    setElements((prevState) => [...prevState, element]);
  };

  // Evenet handler for a moving mouse on the drawing canvas
  const handleMouseMove = (e) => {
    if (!sketching) return;
    const { clientX, clientY } = e;
    const index = elements.length - 1;

    const { x1, y1 } = elements[index];

    const updatedElement = createElement(x1, y1, clientX, clientY);
    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
  };

  const handleMouseUp = () => {
    setSketching(false);
  };
  return (
    <canvas
      id="canvas"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default Sketchboard;
