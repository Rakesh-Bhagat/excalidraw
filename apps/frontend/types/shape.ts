type Point = {
  x: number;
  y: number;
};

export type Shape = {
  
  type: "rectangle" | "ellipse";
  start: Point;
  end: Point;
  width: number;
  height: number;
};