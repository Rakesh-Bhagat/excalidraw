"use client";

import useCanvasResize from "@/hooks/useCanvasResize";
import useDrawShape from "@/hooks/useDrawShape";
import { wsClient } from "@/hooks/useWSClient";
import { useSessionStore } from "@/store/useSessionstore";
import { useShapeStore } from "@/store/useShapeStore";
import { useToolStore } from "@/store/useToolStore";
import { Point, Shape } from "@/types/shape";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const Canvas = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTool = useToolStore((state) => state.currentTool);
  const { addShape, offset, setOffset, zoom, setZoom } = useShapeStore();
  const isSessionStarted = useSessionStore((state) => state.isSessionStarted);

  const size = useCanvasResize();
  const isDragging = useRef(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const lastPos = useRef<Point>({ x: 0, y: 0 });

  const handleShapeDrawn = (shape: Shape) => {
    addShape(roomId, shape);
    if (isSessionStarted) {
      wsClient.sendShape(roomId, shape);
    }
  };

  const { onMouseDown, onMouseUp, onMouseMove } = useDrawShape(
    canvasRef.current,
    useShapeStore.getState().getShapes(roomId),
    currentTool,
    handleShapeDrawn,
    offset,
    zoom
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - offset.x) / zoom;
      const mouseY = (e.clientY - rect.top - offset.y) / zoom;

      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(Math.max(zoom + delta, 0.1), 5);
      const zoomRatio = newZoom / zoom;

      const newOffset = {
        x: offset.x - (mouseX * zoomRatio - mouseX) * zoom,
        y: offset.y - (mouseY * zoomRatio - mouseY) * zoom,
      };

      setZoom(newZoom);
      setOffset(newOffset);
    },
    [offset, zoom, setOffset, setZoom]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const downHandler = (e: MouseEvent) => {
      if (currentTool === "drag") {
        isDragging.current = true;
        setIsMouseDown(true);
        lastPos.current = { x: e.clientX, y: e.clientY };
      } else {
        onMouseDown(e);
      }
    };

    const moveHandler = (e: MouseEvent) => {
      if (isDragging.current && currentTool === "drag") {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;

        setOffset({ x: offset.x + dx, y: offset.y + dy });
        lastPos.current = { x: e.clientX, y: e.clientY };
      } else {
        onMouseMove(e);
      }
    };

    const upHandler = (e: MouseEvent) => {
      if (isDragging.current && currentTool === "drag") {
        isDragging.current = false;
        setIsMouseDown(false);
      } else {
        onMouseUp(e);
      }
    };

    canvas.addEventListener("mousedown", downHandler);
    canvas.addEventListener("mouseup", upHandler);
    canvas.addEventListener("mousemove", moveHandler);

    return () => {
      canvas.removeEventListener("mousedown", downHandler);
      canvas.removeEventListener("mouseup", upHandler);
      canvas.removeEventListener("mousemove", moveHandler);
    };
  }, [onMouseDown, onMouseMove, onMouseUp, currentTool, offset, setOffset]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        className={`bg-[hsl(var(--canvasBackground))] ${currentTool === "drag" ? isMouseDown ? "cursor-grabbing" : "cursor-grab"  :"cursor-crosshair"}`}
      />
    </div>
  );
};

export default Canvas;
