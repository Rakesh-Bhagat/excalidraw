"use client";

import { useState } from "react";
import { wsClient } from "@/hooks/useWSClient";
import { useSessionStore } from "@/store/useSessionstore";

const SessionButton = ({ roomId }: { roomId: string }) => {
  const [error, setError] = useState<string | null>(null);
  const isConnected = useSessionStore((state) => state.isSessionStarted);
  const setIsConnected = useSessionStore((state) => state.setSessionStarted);

  const handleClick = async () => {
    const token = localStorage.getItem("token") || "";

    if (!isConnected) {
      try {
        await wsClient.connect(roomId, token, {
          onOpen: () => {
            setIsConnected(true);
            setError(null);
            console.log("Connected, ready to draw or send shapes");
          },
          onError: () => {
            setError("Failed to connect to session.");
          },
          onClose: () => {
            setIsConnected(false);
            console.warn("Disconnected from session.");
          },
        });
      } catch (err) {
        console.error("Connect failed", err);
      }
    } else {
      wsClient.disconnect();
      setIsConnected(false);
      setError(null);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="p-2 bg-[hsl(var(--icon-selected))] text-white rounded-md"
      >
        {isConnected ? "Stop Session" : "Start Session"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SessionButton;
