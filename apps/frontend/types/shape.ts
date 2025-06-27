import { Drawable } from "roughjs/bin/core";

type Point = {
  x: number;
  y: number;
};

export type ShapeType = "rectangle" | "ellipse";

export type Shape = {
  
  type: ShapeType;
  start: Point;
  end: Point;
  width: number;
  height: number;
  drawable?: Drawable;
};