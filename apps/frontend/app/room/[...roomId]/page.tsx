"use client";
import Canvas from "@/components/Canvas";
import ToolBox from "@/components/ToolBox";

export const CanvasBoard = () => {
  return (
    <div className=" flex relative justify-center">
      <div className=" flex absolute z-10 top-7">
        <ToolBox />
      </div>
      <div>
        <Canvas />
      </div>
    </div>
  );
};

export default CanvasBoard;
