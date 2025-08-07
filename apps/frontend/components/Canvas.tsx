"use client";

import useCanvasResize from "@/hooks/useCanvasResize";
import useDrawShape from "@/hooks/useDrawShape";
import { wsClient } from "@/hooks/useWSClient";
import { useSessionStore } from "@/store/useSessionstore";
import { useShapeStore } from "@/store/useShapeStore";
import { useToolStore } from "@/store/useToolStore";
import { Point, Shape } from "@/types/shape";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import StyleSidebar from "./StyleSidebar";
import { useStyleStore } from "@/store/useStyleStore";
import { useCanvasCursor } from "@/hooks/useCanvasCursor";
import { calculateTextDimensions } from "@/utils/draw";
import { InPlaceTextEditor } from "./InPlaceTextEditor";
import { CanvasTextInput } from "./CanvasTextInput";
import MenuDropdown from "./MenuDropdown";
import { generateUuid } from "@/utils/uuid";

const Canvas = () => {
  const params = useParams();
  const pathname = usePathname();
  const isStandalone = pathname === "/canvas";
  const roomId = isStandalone ? "standalone" : (params.roomId as string);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    id?: string;
  } | null>(null);
  const [inPlaceEditingShape, setInPlaceEditingShape] = useState<Shape | null>(null);


  const currentTool = useToolStore((state) => state.currentTool);
  const {
    addShape,
    offset,
    setOffset,
    zoom,
    setZoom,
    selectedShapeId,
    setSelectedShapeId,
    updateShape,
    roomShapes,
  } = useShapeStore();
  const shapes = useMemo(() => roomShapes[roomId] || [], [roomShapes, roomId]);
  const isSessionStarted = useSessionStore((state) => state.isSessionStarted);

  const { canvasBg, style } = useStyleStore();
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
    if (isClient) {
      const token = localStorage.getItem("token");
      if (isSessionStarted && !isStandalone && token) {
        wsClient.sendShape(roomId, shape);
      }
    }
  };

  const handleTextComplete = (text: string) => {
  if (text.trim() && textInput) {
    if (textInput.id) {
      // Editing existing text
      const existingShape = shapes.find((shape) => shape.id === textInput.id);
      if (existingShape) {
        let updatedShape: Shape = {
          ...existingShape,
          text: text, // Don't trim - preserve line breaks and spaces
        };
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            const dimensions = calculateTextDimensions(
              text,
              existingShape.style || {},
              zoom,
              ctx
            );
            updatedShape = {
              ...updatedShape,
              width: dimensions.width,
              height: dimensions.height,
              end: {
                x: existingShape.start.x + dimensions.width,
                y: existingShape.start.y + dimensions.height,
              },
            };
          }
        }

        updateShape(roomId, updatedShape);
        if (isSessionStarted && !isStandalone && isClient) {
          const token = localStorage.getItem("token");
          if (token) {
            wsClient.sendShape(roomId, updatedShape);
          }
        }
      }
    } else {
      // Creating new text
      let textShape: Shape = {
        id: generateUuid(),
        type: "text",
        start: { x: textInput.x, y: textInput.y },
        end: { x: textInput.x, y: textInput.y },
        width: 0,
        height: 0,
        text: text, // Don't trim - preserve line breaks and spaces
        style: {
          ...style,
          fontSize: style.fontSize || 16,
          fontFamily: style.fontFamily || "Arial",
          textAlign: style.textAlign || "left",
        },
      };
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          const dimensions = calculateTextDimensions(
            text,
            textShape.style || {},
            zoom,
            ctx
          );
          textShape = {
            ...textShape,
            width: dimensions.width,
            height: dimensions.height,
            end: {
              x: textInput.x + dimensions.width,
              y: textInput.y + dimensions.height,
            },
          };
        }
      }
      handleShapeDrawn(textShape);
    }
  }
  setTextInput(null);
};
  const handleTextCancel = () => {
    setTextInput(null);
  };

  const handleInPlaceTextComplete = (text: string) => {
    if (inPlaceEditingShape) {
      const updatedShape = { ...inPlaceEditingShape, text };
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          const dimensions = calculateTextDimensions(
            text,
            inPlaceEditingShape.style || {},
            zoom,
            ctx
          );
          updatedShape.width = dimensions.width;
          updatedShape.height = dimensions.height;
          updatedShape.end = {
            x: inPlaceEditingShape.start.x + dimensions.width,
            y: inPlaceEditingShape.start.y + dimensions.height,
          };
        }
      }
      updateShape(roomId, updatedShape);
      if (isClient) {
        const token = localStorage.getItem("token");
        if (isSessionStarted && !isStandalone && token) {
          wsClient.sendShape(roomId, updatedShape);
        }
      }
    }
    setInPlaceEditingShape(null);
  };

  const handleInPlaceTextCancel = () => {
    setInPlaceEditingShape(null);
  };

  const { onMouseDown, onMouseUp, onMouseMove } = useDrawShape(
    canvasRef.current,
    shapes,
    currentTool,
    handleShapeDrawn,
    offset,
    zoom,
    roomId,
    isSessionStarted,
    {
      onTextClick: (x: number, y: number, shapeId?: string) => {
        setTextInput({ x, y, id: shapeId });
      },
      onTextDoubleClick: (shape: Shape) => {
        setInPlaceEditingShape(shape);
        setTextInput(null); // Close any existing text input
      },
    },
    inPlaceEditingShape?.id
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
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
}, [currentTool, textInput]);

  useEffect(() => {
    shapes.forEach(shape => {
      if (shape.type === "text") {
      }
    });
  }, [shapes]);

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
    if (!isStandalone) {
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
        setSelectedShapeId(null);
        setIsDragging(true);
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
        setIsDragging(false);
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
  }, [
    onMouseDown,
    onMouseMove,
    onMouseUp,
    currentTool,
    offset,
    setOffset,
    isDragging,
    setSelectedShapeId,
  ]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{ backgroundColor: canvasBg }}
      />
      <div className="absolute top-4 left-4 z-50">
        <MenuDropdown />
      </div>
      {currentTool !== "drag" && (
        <div className="absolute left-4  top-20">
          <StyleSidebar />
        </div>
      )}
      {textInput && (
        <CanvasTextInput
          x={textInput.x}
          y={textInput.y}
          zoom={zoom}
          offset={offset}
          onComplete={handleTextComplete}
          onCancel={handleTextCancel}
          initialText={
            textInput.id
              ? shapes.find((shape) => shape.id === textInput.id)?.text || ""
              : ""
          }
          style={{
            fontSize: style.fontSize || 16,
            fontFamily: style.fontFamily || "Gloria Hallelujah",
            stroke: style.stroke,
          }}
        />
      )}
      {inPlaceEditingShape && (
        <InPlaceTextEditor
          shape={inPlaceEditingShape}
          zoom={zoom}
          offset={offset}
          onComplete={handleInPlaceTextComplete}
          onCancel={handleInPlaceTextCancel}
        />
      )}
      
      {isStandalone && isClient && !localStorage.getItem("token") && (
        <div className="absolute bottom-4 right-4 bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-300 text-sm">
          Drawing locally - Sign in to collaborate with others
        </div>
      )}
    </div>
  );
};

export default Canvas;
