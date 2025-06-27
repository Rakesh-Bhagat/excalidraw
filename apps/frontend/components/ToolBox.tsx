import { useToolStore } from "@/store/useToolStore";
import { Circle, Hand, Square } from "lucide-react";

const ToolBox = () => {
  const currentTool = useToolStore((state) => state.currentTool);
  const setCurrentTool = useToolStore((state) => state.setCurrentTool);
  return (
    <div className="flex  p-2 rounded-lg bg-[hsl(var(--toolbox))] text-white">
      <div className="flex gap-2  justify-center items-center">
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full ">
          <button
            onClick={() => {
              setCurrentTool("drag");
            }}
            className={` cursor-pointer p-2 rounded-lg  ${currentTool == "drag" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <Hand  className={`w-5 h-5`} />
          </button>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full">
          <button
            onClick={() => {
              setCurrentTool("rectangle");
            }}
            className={`cursor-pointer p-2 rounded-lg  ${currentTool == "rectangle" ? "bg-[hsl(var(--icon-selected))]" : ""}`}
          >
            <Square className={`w-5 h-5 ${currentTool == 'rectangle'? "fill-current text-[hsl(var(--tool-fill))]": ""}`} />
          </button>
        </div>
        <div className="flex rounded-lg hover:bg-[hsl(var(--icon-hover))] w-full ">
          <button
            onClick={() => {
              setCurrentTool("ellipse");
            }}
            className={`cursor-pointer p-2 rounded-lg  ${currentTool == "ellipse" ? "bg-[hsl(var(--icon-selected))] " : ""}`}
          >
            <Circle className={`w-5 h-5 ${currentTool == 'ellipse'? "fill-current text-[hsl(var(--tool-fill))]": ""}`} />
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ToolBox;
