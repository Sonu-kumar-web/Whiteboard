import React, { useLayoutEffect, useState } from "react";
import Rough from "roughjs/bundled/rough.esm";

const generator = Rough.generator();

function createElement(x1, y1, x2, y2, type) {
   const roughElement =
      type === "line"
         ? generator.line(x1, y1, x2, y2)
         : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
   return { x1, y1, x2, y2, roughElement };
}

const App = () => {
   const [element, setElement] = useState([]);
   const [drawing, setDrawing] = useState(false);
   const [elementType, setElementType] = useState("line");

   useLayoutEffect(() => {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      const roughCanvas = Rough.canvas(canvas);

      element.forEach((ele) => roughCanvas.draw(ele.roughElement));
   }, [element]);

   // When mouse move Down
   const handleMouseDown = (e) => {
      setDrawing(true);

      const { clientX, clientY } = e;

      const element = createElement(
         clientX,
         clientY,
         clientX,
         clientY,
         elementType
      );
      setElement((prevState) => [...prevState, element]);
   };

   // When mouse Move
   const handleMouseMove = (e) => {
      if (!drawing) {
         return;
      }
      const { clientX, clientY } = e;

      const index = element.length - 1;
      const { x1, y1 } = element[index];

      const updateElement = createElement(
         x1,
         y1,
         clientX,
         clientY,
         elementType
      );

      const elementCopy = [...element];
      elementCopy[index] = updateElement;
      setElement(elementCopy);
   };

   // When mouse move UP
   const handleMouseUp = () => {
      setDrawing(false);
   };

   return (
      <div>
         <div style={{ position: "fixed" }}>
            <input
               type="radio"
               id="line"
               checked={elementType === "line"}
               onChange={() => setElementType("line")}
            />
            <label htmlFor="line">Line</label>
            <input
               type="radio"
               id="rectangle"
               checked={elementType === "rectangle"}
               onChange={() => setElementType("rectangle")}
            />
            <label htmlFor="rectangle">Rectangle</label>
         </div>
         <canvas
            id="canvas"
            style={{ background: "lightGray" }}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
         >
            Canvas
         </canvas>
      </div>
   );
};

export default App;
