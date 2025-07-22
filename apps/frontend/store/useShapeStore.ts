import { Shape } from "@/types/shape";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ShapeStore = {
  roomShapes: Record<string, Shape[]>;
  addShape: (roomId: string, shape: Shape) => void;
  setShapes: (roomId: string, shapes: Shape[]) => void;
  clearShapes: (roomId: string) => void;
  getShapes: (roomId: string) => Shape[];
  offset: {x: number, y: number};
  setOffset: (offset: {x: number, y: number}) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  selectedShapeId: string | null;
  setSelectedShapeId: (id: string | null) => void;
  updateShape: (roomId: string, shape: Shape) => void;
  copyShapesToStandalone: (fromRoomId: string) => void;
};

export const useShapeStore = create<ShapeStore>()(
  persist(
    (set, get) => ({
      roomShapes: {},
      offset: {x: 0, y: 0},
      zoom: 1,
      selectedShapeId: null,
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
      setOffset: (offset) => set(() => ({offset})),
      setZoom: (zoom) => set(()=>({zoom})),
      setSelectedShapeId: (id) => set(() => ({selectedShapeId: id})),
      updateShape: (roomId, updateShape) => set((state) => ({
        roomShapes: {
          ...state.roomShapes,
          [roomId]: state.roomShapes[roomId].map((s) => s.id === updateShape.id ? updateShape: s)
        }
      })),
      copyShapesToStandalone: (fromRoomId) => set((state) => ({roomShapes: {
        ...state.roomShapes,
        standalone: [...(state.roomShapes[fromRoomId] || [])]
      }})),
    }),
    {
      name: "shapes-store",
    }
  )
);
