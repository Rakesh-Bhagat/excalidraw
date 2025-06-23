"use client";

import { useToolStore } from "@/store/useToolStore";
import { useEffect, useRef, useState } from "react";

type Point ={
  x: number,
  y: number
}
type Shape ={
  type: 'rectangle' | 'ellipse',
  start: Point,
  end: Point,
  width: number,
  height: number
}

const Canvas = () => {
  const currentTool = useToolStore((state) => state.currentTool)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({width: 0, height: 0})
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<{x: number, y: number} | null>(null)
  const [shapes, setShapes] = useState<Shape[]>([])


  useEffect(() => {
    const updateSize = ()=>{
        setSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return() => {
        window.removeEventListener('resize', updateSize)
    }
  }, []);

  useEffect(()=>{
    if(canvasRef.current){
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if(!ctx) return;

      const drawAllShapes =()=>{
        ctx.clearRect(0,0, canvas.width, canvas.height);
        shapes.forEach((shape) =>{
          ctx.strokeStyle = "#ffffff";
          if(shape.type == 'rectangle'){

            ctx.strokeRect(shape.start.x, shape.start.y, shape.width, shape.height)
          }else if(shape.type == 'ellipse'){
            const centerX = shape.start.x + shape.width/2;
            const centerY = shape.start.y + shape.height/2;
            const radiusX = Math.abs(shape.width) /2;
            const radiusY = Math.abs(shape.height) /2;

            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2*Math.PI);
            ctx.stroke();

          }
        })
      }
      const handleMouseDown = (e: MouseEvent) =>{
        isDrawingRef.current = true;
        startPointRef.current = {x: e.clientX, y: e.clientY}
      }
      const handleMouseUp = (e: MouseEvent) =>{
        const endPoint = {x: e.clientX, y: e.clientY}
        const startPoint = startPointRef.current;
        if(!startPoint)return;
        const width = endPoint.x - startPoint.x;
        const height = endPoint.y - startPoint.y;
        setShapes((prev) => [
          ...prev, 
          { type: currentTool, start: startPoint, end: endPoint, width, height }
        ])
        console.log({ type: currentTool, start: startPoint, end: endPoint, width: width, height: height })
        isDrawingRef.current = false;
        startPointRef.current = null;
      }
      const handleMouseMove = (e: MouseEvent) => {
        if(!isDrawingRef.current || !startPointRef.current) return;
       

          const width = e.clientX - startPointRef.current.x
          const height = e.clientY - startPointRef.current.y

          drawAllShapes()

          
          ctx.strokeStyle = "#ffffff"
          if(currentTool === 'rectangle'){

            ctx.strokeRect(startPointRef.current.x, startPointRef.current.y, width, height)
          }else if (currentTool === 'ellipse'){
            const centerX = startPointRef.current.x + width/2;
            const centerY = startPointRef.current.y + height/2;
            const radiusX = Math.abs(width)/2;
            const radiusY = Math.abs(height)/2;

            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2*Math.PI)
            ctx.stroke();

          }
      }
      drawAllShapes()
      canvas.addEventListener("mousedown", handleMouseDown)
      canvas.addEventListener("mouseup", handleMouseUp)
      canvas.addEventListener("mousemove", handleMouseMove)

      return () =>{
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [shapes, currentTool])

  return (
    <canvas
      ref={canvasRef}
      width={size.width}
      height={size.height}
      className="bg-[hsl(var(--canvasBackground))] cursor-crosshair"
    ></canvas>
  );
};

export default Canvas;
