import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  checkCollision,
  getDimension,
  getXLayers,
  getYLayers,
  transformBase,
} from "./utils";

function App() {
  const appRef = useRef(null);
  const [areas, setAreas] = useState<Box[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([
    {
      width: 50,
      height: 100,
      x: 25,
      y: 150,
    },
    {
      width: 100,
      height: 100,
      x: 275,
      y: 150,
    },
  ]);

  const [itemIndex, setItemIndex] = useState(0);
  const [dragEnabled, setDragEnabled] = useState(false);

  const compute = () => {
    if (!appRef.current) {
      return;
    }
    console.clear();

    const appEl = appRef.current as HTMLDivElement;

    const main = appEl.querySelector(".main") as HTMLDivElement;
    const layers = Array.from(
      appEl.querySelectorAll(".layer")
    ) as HTMLDivElement[];

    const mainData = getDimension(main);
    const layersData = layers.map(getDimension);

    console.log(mainData, layersData);

    const base = transformBase(mainData, mainData);
    const layersBase = layersData.map((data) => transformBase(mainData, data));
    console.log(base, layersBase);

    const layersX = getXLayers(base, layersBase);

    console.log("x layers", layersX);

    const layersY = getYLayers(base, layersBase);
    console.log("y layers", layersY);

    const areas: Box[] = [];
    for (const [l, r] of layersX) {
      for (const [t, b] of layersY) {
        const box: Box = {
          x: l,
          y: t,
          width: r - l,
          height: b - t,
        };

        const collided = checkCollision(box, layersBase);

        console.log("box", collided, box);

        if (!collided) {
          areas.push({
            ...box,
            x: box.x + mainData.x,
            y: box.y + mainData.y,
          });
        }
      }
    }

    console.log("areas", areas);
    // setAreas(areas);

    let largestArea = 0;
    let boxArea = areas[0];
    for (const area of areas) {
      const dimension = area.width * area.height;
      if (dimension > largestArea) {
        largestArea = dimension;
        boxArea = area;
      }
    }

    // x: 25, width: 275,
    // y: 0, height: 300,
    console.log("selected area", boxArea);
    setAreas([boxArea]);
  };

  useLayoutEffect(() => {
    compute();
    // const
  }, [appRef]);

  useEffect(() => {
    if (dragEnabled) {
      const mousemove = (event: any) => {
        setBoxes(
          boxes.map((dimension, index) => {
            if (index !== itemIndex) {
              return dimension;
            }

            return {
              ...dimension,
              x: event.clientX,
              y: event.clientY,
            };
          })
        );
      };

      const mouseup = () => {
        compute();
        setDragEnabled(false);
        document.removeEventListener("mousemove", mousemove);
      };

      document.addEventListener("mouseup", mouseup);
      document.addEventListener("mousemove", mousemove);

      return () => {
        document.removeEventListener("mouseup", mouseup);
        document.removeEventListener("mousemove", mousemove);
      };
    }
  }, [dragEnabled]);

  console.log(boxes);

  return (
    <div className="App" ref={appRef}>
      <div className="main box"></div>

      {boxes.map((box, i) => (
        <div
          key={i}
          className="box layer"
          style={{
            left: `${box.x}px`,
            top: `${box.y}px`,
            width: `${box.width}px`,
            height: `${box.height}px`,
          }}
          onMouseDown={(event) => {
            setDragEnabled(true);
            setItemIndex(i);
          }}
        />
      ))}

      {areas.map((area, i) => (
        <div
          key={i}
          className="area"
          style={{
            left: `${area.x}px`,
            top: `${area.y}px`,
            width: `${area.width}px`,
            height: `${area.height}px`,
          }}
        />
      ))}
    </div>
  );
}

export default App;
