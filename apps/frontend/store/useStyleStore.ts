import { ShapeStyle } from "@/types/shape";
import { create } from "zustand";
export type canvasColor = "#121212" | "#161718" | "#13171c"  | "#181605" | "#1b1615"
interface StyleStore {
  canvasBg: canvasColor,
  setCanvasBg: (color: canvasColor)=>void,
  style: ShapeStyle;
  setStyle: (style: Partial<ShapeStyle>) => void;
  resetStyle: () => void;
}

export const useStyleStore = create<StyleStore>((set) => ({
  canvasBg: '#121212',
  style: {
    stroke: "#d3d3d3",
    strokeWidth: 1,
    roughness: 2,
    strokeStyle: 'solid'
  },
  setStyle: (partial) => {
    set((state) => ({
      style: { ...state.style, ...partial },
    }));
  },
  setCanvasBg: (color) => {
    set(()=> ({
      canvasBg:  color
  }))
  },
  resetStyle: () =>
    set(() => ({
      style: {
        stroke: "#d3d3d3",
        strokeWidth: 1,
        roughness: 2,
        strokeStyle: 'solid'
      },
    })),
}));
