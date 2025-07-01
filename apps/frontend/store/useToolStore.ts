import { ShapeType } from "@/types/shape";
import { create } from "zustand";



interface ToolState {
  currentTool: ShapeType;
  setCurrentTool: (tool: ShapeType) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  currentTool: "select",
  setCurrentTool: (tool) => set({ currentTool: tool }),
}));
