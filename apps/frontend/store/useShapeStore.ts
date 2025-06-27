import { Shape } from "@/types/shape";
import { create } from "zustand";
import { persist } from "zustand/middleware";




type ShapeStore = {
  roomShapes: Record<string, Shape[]>;
  addShape: (roomId: string, shape: Shape) => void;
  setShapes: (roomId: string, shapes: Shape[]) => void;
  clearShapes: (roomId: string) => void;
  getShapes: (roomId: string) => Shape[];
};

export const useShapeStore = create<ShapeStore>()(
  persist(
    (set, get) => ({
      roomShapes: {},
      addShape: (roomId, shape) =>
        set((state) => ({
          roomShapes: {
            ...state.roomShapes,
            [roomId]: [...(state.roomShapes[roomId] || []), shape],
          },
        })),
      setShapes: (roomId, shapes) =>
        set((state) => ({
          roomShapes: {
            ...state.roomShapes,
            [roomId]: shapes,
          },
        })),
      clearShapes: (roomId) =>
        set((state) => {
          const newShapes = { ...state.roomShapes };
          delete newShapes[roomId];
          return { roomShapes: newShapes };
        }),
      getShapes: (roomId) => get().roomShapes[roomId] || [],
    }),
    {
      name: "shapes-store",
    }
  )
);
