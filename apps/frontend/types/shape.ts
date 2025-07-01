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
  strokeStyle?: 'solid' | 'dashed' | 'dotted'
}

export type ShapeType = "rectangle" | "ellipse" | 'drag' | 'select';
export type ResizeHandle = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type Shape = {
  
  type: ShapeType;
  id: string
  start: Point;
  end: Point;
  width: number;
  height: number;
  drawable?: Drawable;
  style?: ShapeStyle;
};