import { useEffect } from "react";
import { Point, Shape } from "@/types/shape";

interface Props {
  canvas: HTMLCanvasElement | null;
  tool: string;
  shapes: Shape[];
  selectedShapeId: string | null;
  zoom: number;
  offset: { x: number; y: number };
  isDragging: boolean;
}

export const useCanvasCursor = ({
  canvas,
  tool,
  shapes,
  selectedShapeId,
  zoom,
  offset,
  isDragging,
}: Props) => {
  useEffect(() => {
    if (!canvas) return;

    const getMousePos = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect();
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

    const handleCursor = (e: MouseEvent) => {
      if (!canvas) return;

      if (tool === "drag") {
        canvas.style.cursor = isDragging ? "grabbing" : "grab";
        return;
      }

      if (tool === "select" && selectedShapeId) {
        const shape = shapes.find((s) => s.id === selectedShapeId);
        if (!shape) {
          canvas.style.cursor = "crosshair";
          return;
        }

        const normX = shape.width < 0 ? shape.start.x + shape.width : shape.start.x;
        const normY = shape.height < 0 ? shape.start.y + shape.height : shape.start.y;
        const normWidth = Math.abs(shape.width);
        const normHeight = Math.abs(shape.height);
        const handleSize = 10 / zoom;

        const corners = [
          { name: "top-left", x: normX, y: normY },
          { name: "top-right", x: normX + normWidth, y: normY },
          { name: "bottom-left", x: normX, y: normY + normHeight },
          { name: "bottom-right", x: normX + normWidth, y: normY + normHeight },
        ];

        for (const corner of corners) {
          if (isInHandle(getMousePos(e), corner, handleSize)) {
            canvas.style.cursor =
              corner.name === "top-left" || corner.name === "bottom-right"
                ? "nwse-resize"
                : "nesw-resize";
            return;
          }
        }

        canvas.style.cursor = "move";
        return;
      }

      canvas.style.cursor = "crosshair";
    };

    canvas.addEventListener("mousemove", handleCursor);

    return () => {
      canvas.removeEventListener("mousemove", handleCursor);
    };
  }, [canvas, tool, selectedShapeId, shapes, zoom, offset, isDragging]);
};
