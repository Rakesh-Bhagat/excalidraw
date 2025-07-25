import { useShapeStore } from "@/store/useShapeStore";
import { useToolStore } from "@/store/useToolStore";
import { Circle, Diamond, Eraser, Hand, Minus, MousePointer, MoveRight, Pencil, Square, TypeOutline } from "lucide-react";

const ToolBox = () => {
  const currentTool = useToolStore((state) => state.currentTool);
  const setCurrentTool = useToolStore((state) => state.setCurrentTool);
  const {setSelectedShapeId} = useShapeStore()
  return (
    <div className="flex  p-2 rounded-lg bg-[hsl(var(--toolbox))] text-white">
      <div className="flex gap-2  justify-center items-center">
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full ">
          <button
            onClick={() => {
              setCurrentTool("drag");
              setSelectedShapeId(null)
            }}
            className={` cursor-pointer p-2 rounded-lg  ${currentTool == "drag" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <Hand  className={`w-5 h-5 scale-y-[1.2]`} />
          </button>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full ">
          <button
            onClick={() => {
              setCurrentTool("select");
            }}
            className={` cursor-pointer p-2 rounded-lg  ${currentTool == "select" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <MousePointer  className={`w-5 h-5 scale-y-[1.2]`} />
          </button>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full">
          <button
            onClick={() => {
              setCurrentTool("rectangle");
              setSelectedShapeId(null)
            }}
            className={`cursor-pointer p-2 rounded-lg  ${currentTool == "rectangle" ? "bg-[hsl(var(--icon-selected))]" : ""}`}
          >
            <Square className={`w-5 h-5 ${currentTool == 'rectangle'? "fill-current text-[hsl(var(--tool-fill))]": ""}`} />
          </button>
        </div>
         <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full ">
          <button
            onClick={() => {
              setCurrentTool("diamond");
              setSelectedShapeId(null)
            }}
            className={`cursor-pointer p-2 rounded-lg  ${currentTool == "diamond" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <Diamond className={`w-5 h-5 ${currentTool == 'diamond'? "fill-current text-[hsl(var(--tool-fill))]": ""}`} />
          </button>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full ">
          <button
            onClick={() => {
              setCurrentTool("ellipse");
              setSelectedShapeId(null)
            }}
            className={`cursor-pointer p-2 rounded-lg  ${currentTool == "ellipse" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <Circle className={`w-5 h-5 ${currentTool == 'ellipse'? "fill-current text-[hsl(var(--tool-fill))]": ""}`} />
          </button>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full ">
          <button
            onClick={() => {
              setCurrentTool("line");
              setSelectedShapeId(null)
            }}
            className={`cursor-pointer p-2 rounded-lg ${currentTool == "line" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <Minus  className={`w-5 h-5 `} />
          </button>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full">
          <button
            onClick={() => {
              setCurrentTool("arrow");
              setSelectedShapeId(null)
            }}
            className={`cursor-pointer p-2 rounded-lg ${currentTool == "arrow" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <MoveRight   className={`w-5 h-5 `} />
          </button>
        </div>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full">
          <button
            onClick={() => {
              setCurrentTool("draw");
              setSelectedShapeId(null)
            }}
            className={`cursor-pointer p-2 rounded-lg ${currentTool == "draw" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <Pencil className={`w-5 h-5`} />
          </button>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full">
          <button
            onClick={() => {
              setCurrentTool("eraser");
              setSelectedShapeId(null)
            }}
            className={`cursor-pointer p-2 rounded-lg ${currentTool == "eraser" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <Eraser  className={`w-5 h-5`} />
          </button>
        </div>

        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full">
          <button
            onClick={() => {
              setCurrentTool("text");
              setSelectedShapeId(null)
            }}
            className={`cursor-pointer p-2 rounded-lg ${currentTool == "text" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <TypeOutline  className={`w-5 h-5`} />
          </button>
        </div>
       
        
      </div>
    
  );
};

export default ToolBox;
