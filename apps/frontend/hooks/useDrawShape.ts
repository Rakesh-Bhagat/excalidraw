import { Shape } from "@/types/shape";
import { clearCanvas, drawShape } from "@/utils/draw";
import { useRef } from "react";

const useDrawShape = (
  canvas: HTMLCanvasElement | null,
  shapes: Shape[],
  currentTool: Shape["type"],
  onShapeDrawn: (shape: Shape) => void
) => {
  const isDrawing = useRef(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = (e: MouseEvent) => {
    isDrawing.current = true;
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDrawing.current || !startPoint.current || !canvas) return;

    const end = { x: e.clientX, y: e.clientY };
    const start = startPoint.current;

    const shape: Shape = {
      type: currentTool,
      start,
      end,
      width: end.x - start.x,
      height: end.y - start.y,
    };

    onShapeDrawn(shape);
    isDrawing.current = false;
    startPoint.current = null;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDrawing.current || !startPoint.current || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    clearCanvas(ctx, canvas.width, canvas.height);
    shapes.forEach((shape) => drawShape(ctx, shape));

    const width = e.clientX - startPoint.current.x;
    const height = e.clientY - startPoint.current.y;

    const previewShape: Shape = {
      type: currentTool,
      start: startPoint.current,
      end: { x: e.clientX, y: e.clientY },
      width,
      height,
    };
    drawShape(ctx, previewShape);
  };
  return { onMouseDown, onMouseMove, onMouseUp };
};

export default useDrawShape;
