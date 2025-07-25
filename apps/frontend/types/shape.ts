import { Drawable } from "roughjs/bin/core";

export type Point = {
  x: number;
  y: number;
};

export type ShapeStyle ={
  stroke?: string;
  strokeWidth?: number;
  fill? : string;
  fillStyle? : 'solid' | 'hachure' | 'cross-hatch';
  fillWeight?: number;
  hachureAngle?: number;
  hachureGap?: number;
  roughness?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right'
}

export type ShapeType = "rectangle" | "ellipse" | 'drag' | 'select' | 'diamond' | 'line' | 'arrow' | 'draw' | 'eraser' | 'text' | 'deleted';
export type ResizeHandle = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type Shape = {
  
  type: ShapeType;
  id: string
  start: Point;
  end: Point;
  width: number;
  height: number;
  drawable?: Drawable;
  points?: Point[];
  text?: string;
  style?: ShapeStyle;
};