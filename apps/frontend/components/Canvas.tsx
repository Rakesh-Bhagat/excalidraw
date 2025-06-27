"use client";

import useCanvasResize from "@/hooks/useCanvasResize";
import useDrawShape from "@/hooks/useDrawShape";
import { wsClient } from "@/hooks/useWSClient";
import { useSessionStore } from "@/store/useSessionstore";
import { useShapeStore } from "@/store/useShapeStore";
import { useToolStore } from "@/store/useToolStore";
import { Shape } from "@/types/shape";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

const Canvas = () => {
  const params = useParams();
  const roomId = params.roomId as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentTool = useToolStore((state) => state.currentTool);
  const { getShapes, addShape } = useShapeStore();
  const shapes = getShapes(roomId);
  const isSessionStarted = useSessionStore((state) => state.isSessionStarted);
  
  const size = useCanvasResize();

  const handleShapeDrawn = (shape: Shape) => {
    addShape(roomId, shape);
    if(isSessionStarted){
      wsClient.sendShape(roomId, shape)
    }
  }

  const { onMouseDown, onMouseUp, onMouseMove} = useDrawShape(
    canvasRef.current,
    shapes,
    currentTool,
    handleShapeDrawn
  );



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [ onMouseDown, onMouseMove, onMouseUp]);


  return (
    <>
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        className="bg-[hsl(var(--canvasBackground))] cursor-crosshair"
      />
    </>
  );
};

export default Canvas;
