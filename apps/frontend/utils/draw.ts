import { Shape } from "@/types/shape";
import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughGenerator } from "roughjs/bin/generator";

// const OPTIONS = {
//   stroke: "#ffffff",
  
//   roughness: 0.7,
//   strokeWidth: 4 ,
  
// };
export const drawShape = (
  roughCanvas: RoughCanvas,
  shape: Shape,
  isSelected: boolean = false,
  zoom: number
) => {
  if (shape.drawable) {
    roughCanvas.draw(shape.drawable);
  }
  if(isSelected){
     const offset = 2000; 
     const normX = shape.width < 0 ? shape.start.x + shape.width : shape.start.x;
    const normY = shape.height < 0 ? shape.start.y + shape.height : shape.start.y;
    const normWidth = Math.abs(shape.width);
    const normHeight = Math.abs(shape.height);

    const selectionBox = roughCanvas.generator.rectangle(
       normX - offset,
      normY - offset,
      normWidth + 2 * offset,
      normHeight + 2 * offset,
      {
        stroke: 'blue',
        strokeWidth: 0.5 / zoom,
        roughness: 0.5,
        bowing: 0,
        fill: undefined,
        fillStyle: undefined,
      }
    );
    roughCanvas.draw(selectionBox)
  }
};
export const generateDrawable = (generator: RoughGenerator, shape: Shape, zoom: number) => {
  const { type, start, width, height } = shape;
  const scaledOptions = {
    stroke: "#d3d3d3",
    roughness: 0.7,
    strokeWidth: 1 / zoom, // Clamp minimum value
  };

  switch (type) {
    case "rectangle":
      return generator.rectangle(start.x, start.y, width, height, scaledOptions);

    case "ellipse":
      const clientX = start.x + width / 2;
      const clientY = start.y + height / 2;
      return generator.ellipse(
        clientX,
        clientY,
        Math.abs(width),
        Math.abs(height),
        scaledOptions
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
