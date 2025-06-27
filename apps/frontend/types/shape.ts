import { Drawable } from "roughjs/bin/core";

export type Point = {
  x: number;
  y: number;
};

export type ShapeType = "rectangle" | "ellipse" | 'drag';

export type Shape = {
  
  type: ShapeType;
  start: Point;
  end: Point;
  width: number;
  height: number;
  drawable?: Drawable;
};