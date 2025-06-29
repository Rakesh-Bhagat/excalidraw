import { Drawable } from "roughjs/bin/core";

export type Point = {
  x: number;
  y: number;
};

export type ShapeType = "rectangle" | "ellipse" | 'drag' | 'select';

export type Shape = {
  
  type: ShapeType;
  id: string
  start: Point;
  end: Point;
  width: number;
  height: number;
  drawable?: Drawable;
};