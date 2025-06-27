import { Shape } from "@/types/shape";
import { clearCanvas, drawShape, generateDrawable } from "@/utils/draw";
import { useRef } from "react";
import rough from "roughjs/bin/rough";
import { RoughCanvas} from 'roughjs/bin/canvas'

const useDrawShape = (
  canvas: HTMLCanvasElement | null,
  shapes: Shape[],
  currentTool: Shape["type"],
  onShapeDrawn: (shape: Shape) => void
) => {
  const isDrawing = useRef(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const roughCanvasRef = useRef<RoughCanvas |null>(null);
  const generatorRef = useRef<ReturnType<typeof rough.generator> | null>(null)

  if(canvas && !roughCanvasRef.current){
    roughCanvasRef.current = rough.canvas(canvas)
    generatorRef.current = rough.generator()
  }

  const onMouseDown = (e: MouseEvent) => {
    isDrawing.current = true;
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDrawing.current || !startPoint.current || !canvas || !generatorRef.current) return;

    const end = { x: e.clientX, y: e.clientY };
    const start = startPoint.current;
    const width = end.x - start.x;
    const height = end.y - start.y;

    const shape: Shape = {
      type: currentTool,
      start,
      end,
      width,
      height,
      drawable: generateDrawable(generatorRef.current, {
        type: currentTool,
        start,
        end,
        width,
        height
      }) ?? undefined
    };

    onShapeDrawn(shape);
    isDrawing.current = false;
    startPoint.current = null;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDrawing.current || !startPoint.current || !canvas) return;

    const ctx = canvas.getContext("2d");
    const roughCanvas = roughCanvasRef.current
    const generator = generatorRef.current 
    if (!ctx || !roughCanvas || !generator) return;

    clearCanvas(ctx, canvas.width, canvas.height);

    shapes.forEach((shape)=>{
        drawShape(roughCanvas, shape);
    })
    
    const width = e.clientX - startPoint.current.x;
    const height = e.clientY - startPoint.current.y;

    const previewShape: Shape = {
      type: currentTool,
      start: startPoint.current,
      end: { x: e.clientX, y: e.clientY },
      width,
      height,
      drawable: generateDrawable(generator,{
        type: currentTool,
        start: startPoint.current,
        end: {x: e.clientX, y: e.clientY},
        width,
        height
      }) ?? undefined
    };

    drawShape(roughCanvas ,previewShape);
  };
  return { onMouseDown, onMouseMove, onMouseUp };
};

export default useDrawShape;
