import { useShapeStore } from "@/store/useShapeStore";
import { Shape } from "@/types/shape";
import rough from "roughjs/bin/rough";
import { generateDrawable } from "@/utils/draw";

const wsRef: { current: WebSocket | null } = { current: null };

const connect = (
  roomId: string,
  token: string,
  callbacks?: {
    onOpen?: () => void;
    onError?: (err: Event) => void;
    onClose?: () => void;
  }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join-room", roomId }));
      callbacks?.onOpen?.();
      resolve();
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      callbacks?.onError?.(err);
      reject(err);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("shape received");
      if (data.type === "chat") {
        const { roomId, message: shape } = data;
        const { getShapes, updateShape, addShape } = useShapeStore.getState();
        const existing = getShapes(roomId).find((s) => s.id === shape.id);
        if (shape.type === "deleted") {
          const newShapes = getShapes(roomId).filter((s) => s.id !== shape.id);
          useShapeStore.getState().setShapes(roomId, newShapes);
          return;
        }

        const generator = rough.generator();
        shape.drawable = generateDrawable(
          generator,
          shape,
          useShapeStore.getState().zoom ?? 1
        );
        if (existing) {
          updateShape(roomId, shape);
          console.log("updated shape");
        } else {
          addShape(roomId, shape);
          console.log("updated shape");
        }
      }
    };

    ws.onclose = () => {
      console.warn("WebSocket closed");
      callbacks?.onClose?.();
      wsRef.current = null;
    };
  });
};

const sendShape = (roomId: string, shape: Shape) => {
  const ws = wsRef.current;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: shape,
      })
    );
    console.log("send");
  } else {
    console.warn("WebSocket not ready, shape not sent");
  }
};

const disconnect = () => {
  wsRef.current?.close();
  wsRef.current = null;
};

export const wsClient = {
  connect,
  sendShape,
  disconnect,
};
