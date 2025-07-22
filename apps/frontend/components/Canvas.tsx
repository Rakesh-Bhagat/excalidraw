"use client";

import useCanvasResize from "@/hooks/useCanvasResize";
import useDrawShape from "@/hooks/useDrawShape";
import { wsClient } from "@/hooks/useWSClient";
import { useSessionStore } from "@/store/useSessionstore";
import { useShapeStore } from "@/store/useShapeStore";
import { useToolStore } from "@/store/useToolStore";
import { Point, Shape } from "@/types/shape";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import StyleSidebar from "./StyleSidebar";
import { useStyleStore } from "@/store/useStyleStore";
import { useCanvasCursor } from "@/hooks/useCanvasCursor";

const Canvas = () => {
  const params = useParams();
  const pathname = usePathname();
  const isStandalone = pathname === "/canvas";
  const roomId = isStandalone ? "standalone" : (params.roomId as string);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);

  const currentTool = useToolStore((state) => state.currentTool);
  const {
    addShape,
    offset,
    setOffset,
    zoom,
    setZoom,
    selectedShapeId,
    setSelectedShapeId,
  } = useShapeStore();
  const shapes = useShapeStore().roomShapes[roomId] || [];
  const isSessionStarted = useSessionStore((state) => state.isSessionStarted);

  const { canvasBg } = useStyleStore();
  const { setCurrentTool } = useToolStore();

  const size = useCanvasResize();
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef<Point>({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShapeDrawn = (shape: Shape) => {
    addShape(isStandalone ? "standalone" : roomId, shape);
    setSelectedShapeId(shape.id);
    setCurrentTool("select");
    if(isClient){
      const token = localStorage.getItem("token");
      if (isSessionStarted && !isStandalone && token) {
        wsClient.sendShape(roomId, shape);
    }  
    }
    
  };

  const { onMouseDown, onMouseUp, onMouseMove } = useDrawShape(
    canvasRef.current,
    shapes,
    currentTool,
    handleShapeDrawn,
    offset,
    zoom,
    roomId,
    isSessionStarted
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      console.log(zoom)
      console.log(offset)
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - offset.x) / zoom;
      const mouseY = (e.clientY - rect.top - offset.y) / zoom;

      const delta = -e.deltaY * 0.0001;
      const newZoom = Math.min(Math.max(zoom * (1 + delta), 0.001), 50);
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

  useCanvasCursor({
    canvas: canvasRef.current,
    tool: currentTool,
    shapes,
    selectedShapeId,
    zoom,
    offset,
    isDragging,
  });

  useEffect(() => {
    if(!isStandalone) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  
  }, [roomId, setZoom, setOffset, isStandalone]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const downHandler = (e: MouseEvent) => {
      if (currentTool === "drag") {
        setSelectedShapeId(null)
        setIsDragging(true)
        lastPos.current = { x: e.clientX, y: e.clientY };
      } else {
        onMouseDown(e);
      }
    };

    const moveHandler = (e: MouseEvent) => {
      if (isDragging && currentTool === "drag") {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;

        setOffset({ x: offset.x + dx, y: offset.y + dy });
        lastPos.current = { x: e.clientX, y: e.clientY };
      } else {
        onMouseMove(e);
      }
    };

    const upHandler = (e: MouseEvent) => {
      if (isDragging && currentTool === "drag") {
        setIsDragging(false)
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
  }, [onMouseDown, onMouseMove, onMouseUp, currentTool, offset, setOffset, isDragging, setSelectedShapeId]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{ backgroundColor: canvasBg }}
        
      />
      {currentTool !== "drag"  &&(
      <div className="absolute left-4  top-20">
        <StyleSidebar />
      </div>
      )}
      {isStandalone && isClient && !localStorage.getItem("token") && (
        <div className="absolute bottom-4 left-4 bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-300 text-sm">
          Drawing locally - Sign in to collaborate with others
        </div>
      )}
    </div>
  );
};

export default Canvas;
