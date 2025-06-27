import { Point, Shape } from "@/types/shape";
import { clearCanvas, drawShape, generateDrawable } from "@/utils/draw";
import { useEffect, useRef } from "react";
import rough from "roughjs/bin/rough";
import { RoughCanvas} from 'roughjs/bin/canvas'

const useDrawShape = (
  canvas: HTMLCanvasElement | null,
  shapes: Shape[],
  currentTool: Shape["type"],
  onShapeDrawn: (shape: Shape) => void,
  offset: {x: number, y: number},
  zoom: number
) => {


  const isDrawing = useRef(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const roughCanvasRef = useRef<RoughCanvas |null>(null);
  const generatorRef = useRef<ReturnType<typeof rough.generator> | null>(null)

  useEffect(() => {
    if (canvas && !roughCanvasRef.current) {
      roughCanvasRef.current = rough.canvas(canvas);
      generatorRef.current = rough.generator();
    }
  }, [canvas]);

  useEffect(() => {
    if (!canvas || !roughCanvasRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1,0,0,1,0,0);

    clearCanvas(ctx, canvas.width, canvas.height);
    ctx.setTransform(zoom, 0,0,zoom, offset.x, offset.y)

    shapes.forEach((shape) => {
      drawShape(roughCanvasRef.current!, shape);
    });
  }, [shapes, canvas, offset, zoom]);

  const getMousePos = (e:MouseEvent): Point =>{
    
    const rect = canvas!.getBoundingClientRect()
    
    return {
      x: (e.clientX - rect.left - offset.x)/ zoom,
      y: (e.clientY - rect.top - offset.y) / zoom
    }
  }

  const onMouseDown = (e: MouseEvent) => {
    if(currentTool === 'drag') return;
    isDrawing.current = true;
    startPoint.current = getMousePos(e);
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDrawing.current || !startPoint.current || !canvas || !generatorRef.current || currentTool === 'drag') return;

    const end = getMousePos(e);
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
    if (!isDrawing.current || !startPoint.current || !canvas || currentTool === 'drag') return;

    const ctx = canvas.getContext("2d");
    const roughCanvas = roughCanvasRef.current
    const generator = generatorRef.current 
    if (!ctx || !roughCanvas || !generator) return;

    ctx.setTransform(1,0,0,1,0,0);

    clearCanvas(ctx, canvas.width, canvas.height);
    ctx.setTransform(zoom, 0,0,zoom, offset.x, offset.y)

    shapes.forEach((shape)=>{
        drawShape(roughCanvas, shape);
    })
    
    const currentPos = getMousePos(e);
    const width = currentPos.x - startPoint.current.x;
    const height = currentPos.y - startPoint.current.y;

    const previewShape: Shape = {
      type: currentTool,
      start: startPoint.current,
      end: currentPos,
      width,
      height,
      drawable: generateDrawable(generator,{
        type: currentTool,
        start: startPoint.current,
        end: currentPos,
        width,
        height
      }) ?? undefined
    };

    drawShape(roughCanvas ,previewShape);
  };
  return { onMouseDown, onMouseMove, onMouseUp };
};

export default useDrawShape;
