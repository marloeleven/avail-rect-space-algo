import { useLayoutEffect, useRef, useState } from "react";
import "./App.css";
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
  const [boxes] = useState<Box[]>([
    {
      width: 50,
      height: 100,
      x: 200,
      y: 150,
    },
    {
      width: 100,
      height: 100,
      x: 50,
      y: 250,
    },
  ]);

  useLayoutEffect(() => {
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

    console.log(layersX);

    const layersY = getYLayers(base, layersBase);
    console.log(layersY);

    const areas: Box[] = [];
    for (const [l, r] of layersX) {
      for (const [t, b] of layersY) {
        const box: Box = {
          x: l,
          y: t,
          width: r - l,
          height: b - t,
        };

        if (!checkCollision(box, layersBase)) {
          areas.push({
            ...box,
            x: box.x + mainData.x,
            y: box.y + mainData.y,
          });
        }
      }
    }

    console.log(areas);
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

    console.log(boxArea);
    setAreas([boxArea]);
    // const
  }, [appRef]);

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
