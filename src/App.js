import React, { useLayoutEffect, useState } from "react";
import Rough from "roughjs/bundled/rough.esm";

const generator = Rough.generator();

function createElement(id, x1, y1, x2, y2, type) {
   let roughElement;
   if (type === "line") {
      roughElement = generator.line(x1, y1, x2, y2);
   } else if (type === "rectangle") {
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
   } else if (type === "circle") {
      roughElement = generator.circle(x1, y1, (x2 - x1) / 2);
   } else if (type === "eclipse") {
      roughElement = generator.ellipse(x1, y1, (x2 - x1) / 2, (y2 - y1) / 2);
   }

   return { id, x1, y1, x2, y2, type, roughElement };
}

function isWithinElement(x, y, element) {
   const { type, x1, x2, y1, y2 } = element;
   if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
   } else if (type === "line") {
      const a = { x1, y1 };
      const b = { x2, y2 };
      const c = { x, y };
      const offset = distance(a, b) - distance(a, c) + distance(b, c);
      return Math.abs(offset) < 1;
   } else if (type === "circle") {
      const a = { x1, y1 };
      const b = { x2, y2 };
      const c = { x, y };
      const offset = distance(a, b) - distance(a, c) + distance(b, c);
      return Math.abs(offset) < 1;
   } else if (type === "eclipse") {
      const a = { x1, y1 };
      const b = { x2, y2 };
      const c = { x, y };
      const offset = distance(a, b) - distance(a, c) + distance(b, c);
      return Math.abs(offset) < 1;
   }
}

const distance = (a, b) => {
   Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

function getElementAtPosition(x, y, element) {
   return element.find((ele) => isWithinElement(x, y, ele));
}

const App = () => {
   const [element, setElement] = useState([]);
   const [action, setAction] = useState("none");
   const [tool, setTool] = useState("line");
   const [selectedElement, setSelectedElement] = useState(null);

   useLayoutEffect(() => {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      const roughCanvas = Rough.canvas(canvas);

      element.forEach((ele) => roughCanvas.draw(ele.roughElement));
   }, [element]);

   const updateElement = (id, x1, y1, x2, y2, type) => {
      const updateElement = createElement(id, x1, y1, x2, y2, type);

      const elementCopy = [...element];
      elementCopy[id] = updateElement;
      setElement(elementCopy);
   };

   // When mouse move Down
   const handleMouseDown = (e) => {
      const { clientX, clientY } = e;
      if (tool === "selection") {
         const ele = getElementAtPosition(clientX, clientY, element);
         if (ele) {
            const offsetX = clientX - ele.x1;
            const offsetY = clientY - ele.y1;

            setSelectedElement({ ...ele, offsetX, offsetY });
            setAction("moving");
         }
      } else {
         const id = element.length;
         const ele = createElement(
            id,
            clientX,
            clientY,
            clientX,
            clientY,
            tool
         );
         setElement((prevState) => [...prevState, ele]);
         setAction("drawing");
      }
   };

   // When mouse Move
   const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      if (tool === "selection") {
         e.target.style.cursor = getElementAtPosition(clientX, clientY, element)
            ? "move"
            : "default";
      }

      if (action === "drawing") {
         const index = element.length - 1;
         const { x1, y1 } = element[index];

         updateElement(index, x1, y1, clientX, clientY, tool);
      } else if (action === "moving") {
         const { id, x1, y1, x2, y2, type, offsetX, offsetY } = selectedElement;
         const width = x2 - x1;
         const height = y2 - y1;
         const newX1 = clientX - offsetX;
         const newY1 = clientY - offsetY;
         updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
      }
   };

   // When mouse move UP
   const handleMouseUp = () => {
      setAction("none");
      setSelectedElement(null);
   };

   return (
      <div>
         <div style={{ position: "fixed" }}>
            <input
               type="radio"
               id="selection"
               checked={tool === "selection"}
               onChange={() => setTool("selection")}
            />
            <label htmlFor="selection">Selection</label>
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
               checked={tool === "rectangle"}
               onChange={() => setTool("rectangle")}
            />
            <label htmlFor="rectangle">Rectangle</label>
            <input
               type="radio"
               id="circle"
               checked={tool === "circle"}
               onChange={() => setTool("circle")}
            />
            <label htmlFor="rectangle">Circle</label>
            <input
               type="radio"
               id="eclipse"
               checked={tool === "eclipse"}
               onChange={() => setTool("eclipse")}
            />
            <label htmlFor="rectangle">Eclipse</label>
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
