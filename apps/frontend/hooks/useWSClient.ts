import {  useShapeStore } from "@/store/useShapeStore";
import { Shape } from "@/types/shape";

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
      if (data.type === "chat") {
        useShapeStore.getState().addShape(data.roomId, data.message);
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
