"use client";
import Canvas from "@/components/Canvas";
import SessionButton from "@/components/SessionButton";
import ToolBox from "@/components/ToolBox";
import { wsClient } from "@/hooks/useWSClient";
import { useSessionStore } from "@/store/useSessionstore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const CanvasBoard = () => {
  const params = useParams();
  const roomId = params.roomId as string;

  const isSessionStarted = useSessionStore((state) => state.isSessionStarted);
  const setSessionStarted = useSessionStore((state) => state.setSessionStarted);
  console.log(roomId)
   useEffect(() => {
    if (!roomId || isSessionStarted) return;

    const token = localStorage.getItem("token") || "";

    wsClient.connect(roomId, token, {
      onOpen: () => {
        setSessionStarted(true);
        console.log("Auto-connected to WebSocket session");
      },
      onError: (err) => {
        console.error("WebSocket connection error", err);
      },
      onClose: () => {
        setSessionStarted(false);
        console.warn("WebSocket disconnected");
      },
    });
  }, [roomId, isSessionStarted, setSessionStarted]);
  return (
    <div className=" flex relative justify-center">
      <div className=" flex absolute z-10 top-7">
        <ToolBox />
      </div>
      <div className="z-12 flex absolute top-7 right-3">
        <SessionButton roomId={roomId}/>
      </div>
      <div>
        <Canvas />
      </div>
    </div>
  );
};

export default CanvasBoard;
