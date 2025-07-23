import { Shape } from "@/types/shape";
import { RoughCanvas } from "roughjs/bin/canvas";
import { RoughGenerator } from "roughjs/bin/generator";
import { Point } from "roughjs/bin/geometry";

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
  if (shape.type === "deleted") return;
  if (shape.drawable) {
    roughCanvas.draw(shape.drawable);
  }
  if (isSelected) {
    const offset = 5;
    const normX = shape.width < 0 ? shape.start.x + shape.width : shape.start.x;
    const normY =
      shape.height < 0 ? shape.start.y + shape.height : shape.start.y;
    const normWidth = Math.abs(shape.width);
    const normHeight = Math.abs(shape.height);

    const selectionBox = roughCanvas.generator.rectangle(
      normX - offset,
      normY - offset,
      normWidth + 2 * offset,
      normHeight + 2 * offset,
      {
        stroke: "blue",
        strokeWidth: 0.5 / zoom,
        roughness: 0.5,
        bowing: 0,
        fill: undefined,
        fillStyle: undefined,
      }
    );
    roughCanvas.draw(selectionBox);
    const handleSize = 10 / zoom;
    const halfhandle = handleSize / 2;

    const corners = [
      { x: normX, y: normY },
      { x: normX + normWidth, y: normY },
      { x: normX, y: normY + normHeight },
      { x: normX + normWidth, y: normY + normHeight },
    ];

    corners.forEach(({ x, y }) => {
      const handle = roughCanvas.generator.rectangle(
        x - halfhandle,
        y - halfhandle,
        handleSize,
        handleSize,
        {
          stroke: "blue",
          strokeWidth: 1 / zoom,
          roughness: 0.2,
          fill: "blue",
          fillStyle: "solid",
        }
      );
      roughCanvas.draw(handle);
    });
  }
};
export const generateDrawable = (
  generator: RoughGenerator,
  shape: Shape,
  zoom: number
) => {
  const { type, start, end, width, height, style = {}, points } = shape;
  const scaledOptions = {
    stroke: style.stroke ?? "#d3d3d3",
    roughness: style.roughness ?? 2,
    strokeWidth: (style.strokeWidth ?? 1) / zoom,
    fill: style.fill,
    fillStyle: style.fillStyle,
    dashGap:
      style.strokeStyle === "dashed"
        ? 4 / zoom
        : style.strokeStyle === "dotted"
          ? 1.5 / zoom
          : undefined,
    dashOffset: style.strokeStyle === "dotted" ? 2 / zoom  : undefined,

    seed: parseInt(shape.id.slice(0, 8), 16),
    disableMultiStroke: true,
    preserveVertices: true,
  };
  if (style.fill) {
    scaledOptions.fill = style.fill;
    scaledOptions.fillStyle = style.fillStyle ?? "hachure";
  }

  switch (type) {
    case "rectangle":
      return generator.rectangle(
        start.x,
        start.y,
        width,
        height,
        scaledOptions
      );

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
    case "diamond":
      const midX = start.x + width / 2;
      const midY = start.y + height / 2;
      const diamondPoints: Point[] = [
        [midX, start.y],
        [start.x + width, midY],
        [midX, start.y + height],
        [start.x, midY],
      ];
      return generator.polygon(diamondPoints, scaledOptions);

    case "line":
      return generator.line(start.x, start.y, end.x, end.y, scaledOptions);
    case 'arrow':
      const baseLine = generator.line(start.x, start.y, shape.end.x, shape.end.y, scaledOptions);

  // Arrowhead calculations
  const arrowLength = 15 / zoom;
  const angle = Math.atan2(shape.end.y - start.y, shape.end.x - start.x);
  const arrowAngle = Math.PI / 7;

  const arrowPoint1: [number, number] = [
    shape.end.x - arrowLength * Math.cos(angle - arrowAngle),
    shape.end.y - arrowLength * Math.sin(angle - arrowAngle),
  ];

  const arrowPoint2: [number, number] = [
    shape.end.x - arrowLength * Math.cos(angle + arrowAngle),
    shape.end.y - arrowLength * Math.sin(angle + arrowAngle),
  ];

  const arrowHead = generator.polygon(
    [arrowPoint1, [shape.end.x, shape.end.y], arrowPoint2],
    scaledOptions
  );

  return {
    shape: 'arrow',
    sets: [...baseLine.sets, ...arrowHead.sets],
    options: baseLine.options,
  };
  case 'draw':
    if(!points || points.length < 2)return null
    const roughPoints = points.map(p => [p.x, p.y]) as [number, number][];
    return generator.curve(roughPoints, scaledOptions)
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
