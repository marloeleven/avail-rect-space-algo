export function getDimension(el: HTMLElement) {
  return {
    x: el.offsetLeft,
    y: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight,
    get right() {
      return this.x + this.width;
    },
    get bottom() {
      return this.y + this.height;
    },
  };
}

export type Dimension = ReturnType<typeof getDimension>;

export function transformBase(main: Dimension, box: Dimension): Dimension {
  return {
    x: box.x - main.x,
    y: box.y - main.y,
    width: box.width,
    height: box.height,
    get right() {
      return this.x + this.width;
    },
    get bottom() {
      return this.y + this.height;
    },
  };
}

export function checkCollision(box: Box, layers: Dimension[]) {
  return layers.find((layer) => {
    return (
      box.x < layer.x + layer.width &&
      box.x + box.width > layer.x &&
      box.y < layer.y + layer.height &&
      box.height + box.y > layer.y
    );
  });
}

export function getXLayers(base: Dimension, list: Dimension[]) {
  const layersX = [[0, base.width]];
  // main
  for (const box of list) {
    if (box.x > 0) {
      layersX.push([0, box.x]);
    }
  }

  for (const box of list) {
    if (box.right < base.right) {
      layersX.push([box.right, base.right]);
    }
  }

  return layersX;
}

export function getYLayers(base: Dimension, list: Dimension[]) {
  const layersY = [[0, base.height]];
  // main
  for (const box of list) {
    if (box.y > 0) {
      layersY.push([0, box.y]);
    }
  }

  for (const box of list) {
    if (box.bottom < base.bottom) {
      layersY.push([box.bottom, base.bottom]);
    }
  }

  return layersY;
}

export type Box = Omit<Dimension, "right" | "bottom">;
