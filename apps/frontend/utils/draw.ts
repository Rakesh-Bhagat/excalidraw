import { Shape } from "@/types/shape";

export const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
   ctx.strokeStyle = "#d3d3d3";

  if (shape.type === "rectangle") {
   
    ctx.strokeRect(shape.start.x, shape.start.y, shape.width, shape.height);
  } else if (shape.type === "ellipse") {
    const centerX = shape.start.x + shape.width / 2;
    const centerY = shape.start.y + shape.height / 2;
    const radiusX = Math.abs(shape.width) / 2;
    const radiusY = Math.abs(shape.height) / 2;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
  }
};

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.clearRect(0, 0, width, height);
};
