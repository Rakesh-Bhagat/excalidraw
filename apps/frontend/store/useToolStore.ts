import { create } from "zustand";

type Tool = "rectangle" | "ellipse";

interface ToolState {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  currentTool: "rectangle",
  setCurrentTool: (tool) => set({ currentTool: tool }),
}));
