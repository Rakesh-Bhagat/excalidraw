import isEqual from "lodash.isequal";
import { Point, ResizeHandle, Shape } from "@/types/shape";
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
  const currentPoints = useRef<Point[]>([]);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const resizeHandle = useRef<ResizeHandle | null>(null);

  const roughCanvasRef = useRef<RoughCanvas | null>(null);
  const generatorRef = useRef<ReturnType<typeof rough.generator> | null>(null);

  const { selectedShapeId, setSelectedShapeId, updateShape } = useShapeStore();
  const style = useStyleStore.getState().style;

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

  useEffect(() => {
    if (!selectedShapeId || !generatorRef.current) return;

    const selectedShape = shapes.find((s) => s.id === selectedShapeId);
    if (!selectedShape) return;
    const targetStyle =
    selectedShape.type === "draw" ? { ...style, roughness: 0 } : style;

    if (isEqual(selectedShape.style, targetStyle)) return;

    const updatedShape: Shape = {
      ...selectedShape,
      style: targetStyle,
      drawable:
        generateDrawable(
          generatorRef.current,
          {
            ...selectedShape,
            style: targetStyle,
          },
          zoom
        ) ?? undefined,
    };
    updateShape(roomId, updatedShape);
    if (isSessionStarted) {
      wsClient.sendShape(roomId, updatedShape);
    }
  }, [
    style,
    selectedShapeId,
    isSessionStarted,
    zoom,
    roomId,
    updateShape,
  ]);

  const getMousePos = (e: MouseEvent): Point => {
    const rect = canvas!.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left - offset.x) / zoom,
      y: (e.clientY - rect.top - offset.y) / zoom,
    };
  };

  const isInHandle = (mouse: Point, handle: Point, size: number): boolean => {
    return (
      mouse.x >= handle.x - size / 2 &&
      mouse.x <= handle.x + size / 2 &&
      mouse.y >= handle.y - size / 2 &&
      mouse.y <= handle.y + size / 2
    );
  };

  const onMouseDown = (e: MouseEvent) => {
    if (currentTool === "drag") return;
    const mousePos = getMousePos(e);
    if (currentTool === "draw") {
      isDrawing.current = true;
      const pos = getMousePos(e);
      startPoint.current = pos;
      currentPoints.current = [pos];
      return;
    }

    if (currentTool === "select") {
      if (selectedShapeId) {
        const shape = shapes.find((s) => s.id === selectedShapeId);
        if (shape) {
          const normX =
            shape.width < 0 ? shape.start.x + shape.width : shape.start.x;
          const normY =
            shape.height < 0 ? shape.start.y + shape.height : shape.start.y;
          const normWidth = Math.abs(shape.width);
          const normHeight = Math.abs(shape.height);
          const handleSize = 10 / zoom;

          const corners = [
            { name: "top-left", x: normX, y: normY },
            { name: "top-right", x: normX + normWidth, y: normY },
            { name: "bottom-left", x: normX, y: normY + normHeight },
            {
              name: "bottom-right",
              x: normX + normWidth,
              y: normY + normHeight,
            },
          ];

          for (const corner of corners) {
            if (isInHandle(mousePos, corner, handleSize)) {
              resizeHandle.current = corner.name as ResizeHandle;
              isDrawing.current = true;
              startPoint.current = mousePos;
              return;
            }
          }
        }
      }
    }

    const selected = shapes.find(({ start, width, height }) => {
      const normX = width < 0 ? start.x + width : start.x;
      const normY = height < 0 ? start.y + height : start.y;
      const normWidth = Math.abs(width);
      const normHeight = Math.abs(height);

      return (
        mousePos.x >= normX &&
        mousePos.x <= normX + normWidth &&
        mousePos.y >= normY &&
        mousePos.y <= normY + normHeight
      );
    });

    if (selected) {
      setSelectedShapeId(selected.id);
      useStyleStore.getState().setStyle(selected.style!);
      isDrawing.current = true;
      startPoint.current = mousePos;
    } else {
      setSelectedShapeId(null);
    }

    isDrawing.current = true;
    startPoint.current = mousePos;
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
      resizeHandle.current = null;
      return;
    }

    if (currentTool === "draw" && currentPoints.current.length > 1) {
      const points = [...currentPoints.current];
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);

      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);

      const start = { x: minX, y: minY };
      const end = { x: maxX, y: maxY };
      const width = maxX - minX;
      const height = maxY - minY;
      const shape: Shape = {
        id: crypto.randomUUID(),
        type: "draw",
        start,
        end,
        width,
        height,
        points,
        style: {
          ...style,
          roughness: 0,
        },
        drawable:
          generateDrawable(
            generatorRef.current,
            {
              id: "temp",
              type: "draw",
              start,
              end,
              width: 0,
              height: 0,
              style: {
                ...style,
                roughness: 0,
              },
              points,
            },
            zoom
          ) ?? undefined,
      };
      onShapeDrawn(shape);
      isDrawing.current = false;
      currentPoints.current = [];
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
    resizeHandle.current = null;
    startPoint.current = null;
  };

  const onMouseMove = (e: MouseEvent) => {
    const currentPos = getMousePos(e);

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

    if (resizeHandle.current && selectedShapeId) {
      const shape = shapes.find((s) => s.id === selectedShapeId);
      if (!shape) return;

      let newStart = { ...shape.start };
      let newEnd = { ...shape.end };

      switch (resizeHandle.current) {
        case "top-left":
          newStart = currentPos;
          break;

        case "top-right":
          newStart = { x: shape.start.x, y: currentPos.y };
          newEnd = { x: currentPos.x, y: shape.end.y };
          break;
        case "bottom-left":
          newStart = { x: currentPos.x, y: shape.start.y };
          newEnd = { x: shape.end.x, y: currentPos.y };
          break;

        case "bottom-right":
          newEnd = currentPos;
          break;
      }
      const newWidth = newEnd.x - newStart.x;
      const newHeight = newEnd.y - newStart.y;
      let updatedPoints = shape.points;
      if (shape.type === "draw" && shape.points) {
        const scaleX = newWidth / shape.width;
        const scaleY = newHeight / shape.height;

        updatedPoints = shape.points.map((p) => ({
          x: newStart.x + (p.x - shape.start.x) * scaleX,
          y: newStart.y + (p.y - shape.start.y) * scaleY,
        }));
      }
      const updatedShape: Shape = {
        ...shape,
        start: newStart,
        end: newEnd,
        width: newWidth,
        height: newHeight,
        points: updatedPoints,
        drawable:
          generateDrawable(
            generator,
            {
              ...shape,
              start: newStart,
              end: newEnd,
              width: newWidth,
              height: newHeight,
              points: updatedPoints,
            },
            zoom
          ) ?? undefined,
      };
      updateShape(roomId, updatedShape);
      if (isSessionStarted) {
        wsClient.sendShape(roomId, updatedShape);
      }
      return;
    }

    if (currentTool === "draw" && isDrawing.current) {
      const pos = getMousePos(e);
      currentPoints.current.push(pos);
      const start = currentPoints.current[0];
      const end = pos;
      const width = end.x - start.x;
      const height = end.y - start.y;
      const previewShape: Shape = {
        id: "temp-preview",
        type: "draw",
        start,
        end,
        width,
        height,
        points: [...currentPoints.current],
        style: {
          ...style,
          roughness: 0,
        },
        drawable:
          generateDrawable(
            generator,
            {
              id: "temp-preview",
              type: "draw",
              start: currentPoints.current[0],
              end: pos,
              width: 0,
              height: 0,
              points: [...currentPoints.current],
              style: {
                ...style,
                roughness: 0,
              },
            },
            zoom
          ) ?? undefined,
      };
      drawShape(roughCanvas, previewShape, false, zoom);
      return;
    }

    if (currentTool === "select" && selectedShapeId) {
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
      let updatedPoints = selectedShape.points;
      if (selectedShape.type === "draw" && selectedShape.points) {
        updatedPoints = selectedShape.points.map((p) => ({
          x: p.x + dx,
          y: p.y + dy,
        }));
      }
      const updatedShape: Shape = {
        ...selectedShape,
        start: newStart,
        end: newEnd,
        style: selectedShape.style,
        width: newEnd.x - newStart.x,
        height: newEnd.y - newStart.y,
        points: updatedPoints,
        drawable:
          generateDrawable(
            generator,
            {
              ...selectedShape,
              start: newStart,
              end: newEnd,
              style: selectedShape.style,
              points: updatedPoints,
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
