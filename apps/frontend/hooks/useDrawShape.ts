import isEqual from "lodash.isequal";
import { Point, Shape } from "@/types/shape";
import { clearCanvas, drawShape, generateDrawable } from "@/utils/draw";
import { useEffect, useRef } from "react";
import rough from "roughjs/bin/rough";
import { RoughCanvas } from "roughjs/bin/canvas";
import { useShapeStore } from "@/store/useShapeStore";
import { wsClient } from "./useWSClient";
import { useStyleStore } from "@/store/useStyleStore";

const useDrawShape = (
  canvas: HTMLCanvasElement | null,
  shapes: Shape[],
  currentTool: Shape["type"],
  onShapeDrawn: (shape: Shape) => void,
  offset: { x: number; y: number },
  zoom: number,
  roomId: string,
  isSessionStarted: boolean
) => {
  const isDrawing = useRef(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const roughCanvasRef = useRef<RoughCanvas | null>(null);
  const generatorRef = useRef<ReturnType<typeof rough.generator> | null>(null);

  const { selectedShapeId, setSelectedShapeId, updateShape } = useShapeStore();
  const style = useStyleStore.getState().style

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

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    clearCanvas(ctx, canvas.width, canvas.height);
    ctx.setTransform(zoom, 0, 0, zoom, offset.x, offset.y);

    shapes.forEach((shape) => {
      drawShape(
        roughCanvasRef.current!,
        shape,
        shape.id === selectedShapeId,
        zoom
      );
    });
  }, [shapes, canvas, offset, zoom, selectedShapeId]);

  useEffect(()=>{
    if(!selectedShapeId || !generatorRef.current) return;

    const selectedShape = shapes.find((s) => s.id === selectedShapeId)
    if(!selectedShape) return;

    if (isEqual(selectedShape.style, style)) return;

    const updatedShape: Shape = {
      ...selectedShape,
      style,
      drawable: generateDrawable(generatorRef.current, {
        ...selectedShape, 
        style
      }, zoom) ?? undefined
    };
    updateShape(roomId, updatedShape);
    if(isSessionStarted){
      wsClient.sendShape(roomId, updatedShape)
    }
  }, [style, selectedShapeId, isSessionStarted, zoom, shapes, roomId, updateShape])

  const getMousePos = (e: MouseEvent): Point => {
    const rect = canvas!.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left - offset.x) / zoom,
      y: (e.clientY - rect.top - offset.y) / zoom,
    };
  };

  const onMouseDown = (e: MouseEvent) => {
    if (currentTool === "drag") return;

    if (currentTool === "select") {
      const mousePos = getMousePos(e);
      const selected = shapes.find(
        ({ start, width, height }) =>
          mousePos.x >= start.x &&
          mousePos.x <= start.x + width &&
          mousePos.y >= start.y &&
          mousePos.y <= start.y + height
      );

      if (selected) {
        setSelectedShapeId(selected.id);
        useStyleStore.getState().setStyle(selected.style!);
        isDrawing.current = true;
        startPoint.current = mousePos;
      } else {
        setSelectedShapeId(null);
      }
      return;
    }
    setSelectedShapeId(null);
    isDrawing.current = true;
    startPoint.current = getMousePos(e);
  };

  const onMouseUp = (e: MouseEvent) => {
    if (
      !isDrawing.current ||
      !startPoint.current ||
      !canvas ||
      !generatorRef.current ||
      currentTool === "drag"
    )
      return;

    if (currentTool === "select") {
      isDrawing.current = false;
      startPoint.current = null;
      return;
    }
    const end = getMousePos(e);
    const start = startPoint.current;
    const width = end.x - start.x;
    const height = end.y - start.y;
    

    const shape: Shape = {
      id: crypto.randomUUID(),
      type: currentTool,
      start,
      end,
      width,
      height,
      style,
      drawable:
        generateDrawable(
          generatorRef.current,
          {
            id: "temp",
            type: currentTool,
            start,
            end,
            width,
            height,
            style,
          },
          zoom
        ) ?? undefined,
    };

    onShapeDrawn(shape);
    isDrawing.current = false;
    startPoint.current = null;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (
      !isDrawing.current ||
      !startPoint.current ||
      !canvas ||
      currentTool === "drag"
    )
      return;

    const ctx = canvas.getContext("2d");
    const roughCanvas = roughCanvasRef.current;
    const generator = generatorRef.current;
    if (!ctx || !roughCanvas || !generator) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    clearCanvas(ctx, canvas.width, canvas.height);
    ctx.setTransform(zoom, 0, 0, zoom, offset.x, offset.y);

    shapes.forEach((shape) => {
      drawShape(roughCanvas, shape, shape.id === selectedShapeId, zoom);
    });

    const currentPos = getMousePos(e);

    if (currentTool === "select") {
      const selectedShape = shapes.find((s) => s.id === selectedShapeId);
      if (!selectedShape) return;

      const dx = currentPos.x - startPoint.current.x;
      const dy = currentPos.y - startPoint.current.y;

      const newStart = {
        x: selectedShape.start.x + dx,
        y: selectedShape.start.y + dy,
      };
      const newEnd = {
        x: selectedShape.end.x + dx,
        y: selectedShape.end.y + dy,
      };

      const updatedShape: Shape = {
        ...selectedShape,
        start: newStart,
        end: newEnd,
        style: selectedShape.style,
        drawable:
          generateDrawable(
            generator,
            {
              ...selectedShape,
              start: newStart,
              end: newEnd,
              style: selectedShape.style,
            },
            zoom
          ) ?? undefined,
      };

      updateShape(roomId, updatedShape);
      startPoint.current = currentPos;

      if (isSessionStarted) {
        wsClient.sendShape(roomId, updatedShape);
      }
      return;
    }
    const width = currentPos.x - startPoint.current.x;
    const height = currentPos.y - startPoint.current.y;
    

    const previewShape: Shape = {
      id: "temp-preview",
      type: currentTool,
      start: startPoint.current,
      end: currentPos,
      width,
      height,
      style,
      drawable:
        generateDrawable(
          generator,
          {
            id: "temp-preview",
            type: currentTool,
            start: startPoint.current,
            end: currentPos,
            width,
            height,
            style,
          },
          zoom
        ) ?? undefined,
    };

    drawShape(roughCanvas, previewShape, false, zoom);
  };
  return { onMouseDown, onMouseMove, onMouseUp };
};

export default useDrawShape;
