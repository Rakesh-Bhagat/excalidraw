import { Shape } from "@/types/shape";
import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughGenerator } from "roughjs/bin/generator";

const OPTIONS = {
  stroke: "#d3d3d3",
  roughness: 1,
};
export const drawShape = (
  roughCanvas: RoughCanvas,
  shape: Shape
) => {
  if (shape.drawable) {
    roughCanvas.draw(shape.drawable);
  }
};
export const generateDrawable = (generator: RoughGenerator, shape: Shape) => {
  const { type, start, width, height } = shape;

  switch (type) {
    case "rectangle":
      return generator.rectangle(start.x, start.y, width, height, OPTIONS);

    case "ellipse":
      const clientX = start.x + width / 2;
      const clientY = start.y + height / 2;
      return generator.ellipse(
        clientX,
        clientY,
        Math.abs(width),
        Math.abs(height),
        OPTIONS
      );

    default:
      return null;
  }
};

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.clearRect(0, 0, width, height);
};
