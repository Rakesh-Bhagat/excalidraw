"use client";

import { useState, useEffect } from "react";
import { wsClient } from "@/hooks/useWSClient";
import { useSessionStore } from "@/store/useSessionstore";
import { useShapeStore } from "@/store/useShapeStore";
import axios from "axios";
import { useRouter } from "next/navigation";

const SessionButton = ({ roomId }: { roomId: string }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const isConnected = useSessionStore((state) => state.isSessionStarted);
  const setIsConnected = useSessionStore((state) => state.setSessionStarted);
  const { getShapes, setShapes } = useShapeStore();
  const router = useRouter();
  const isStandalone = roomId === "standalone";

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = async () => {
    const token = localStorage.getItem("token") || "";
    if(!token && isStandalone) {
      setError("Please sign in to start a collaboration session.");
      router.push("/signin")
      return;
    }
    
    setLoading(true);

    if (!isConnected) {
      if (isStandalone) {
        try {
          const standaloneShapes = getShapes("standalone");
          const serverUrl = process.env.NEXT_PUBLIC_HTTP_URL;
          const response = await axios.post(
            `${serverUrl}/room`,
            {
              name: `Canvas Session ${new Date().toLocaleString()}`,
            },
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );

          const newroomId = response.data.id;

          setShapes(newroomId, standaloneShapes);
          if (standaloneShapes.length > 0) {
            // Save shapes to the new room
            try {
              await axios.post(
                `${serverUrl}/bulkShapes/${newroomId}`,
                {
                  shapes: standaloneShapes,
                },
                {
                  headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                  },
                }
              );
              // console.log("Shapes saved successfully:", shapesResponse.data);
            } catch (shapesError) {
              console.error("Failed to save shapes:", shapesError);
            }
          }

          router.push(`/room/${newroomId}`);
          // console.log("Standalone session created with roomId:", newroomId);
          setIsConnected(false);
          setError(null);
          // console.log("Connected, ready to draw or send shapes");
        } catch (error) {
          console.error("Failed to create standalone session", error);
        }
      } else {
        try {
          await wsClient.connect(roomId, token, {
            onOpen: () => {
              setIsConnected(true);
              setError(null);
              // console.log("Connected, ready to draw or send shapes");
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
      }
    } else {
      if (!isStandalone) {
        const currentShapes = getShapes(roomId);
        setShapes("standalone", currentShapes);
        wsClient.disconnect();
        setIsConnected(false);
        setError(null);
        router.push("/canvas");
      } else {
        wsClient.disconnect();
        setIsConnected(false);
        setError(null);
      }
    }
    setLoading(false);
  };
  const getButtonText = () => {
    if (loading) return "Loading...";
    if(isStandalone){
      if(!isClient) return "Loading...";
      const token = localStorage.getItem("token");
      return token ? "Start Session" : "Sign In to Collaborate";
    }
    return isConnected ? "Stop Session" : "Start Session";
    };

    if (!isClient) {
    return (
      <div>
        <button
          disabled
          className="p-2 bg-[hsl(var(--icon-selected))] text-white rounded-md disabled:opacity-50"
        >
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className="p-2 bg-[hsl(var(--icon-selected))] text-white rounded-md disabled:opacity-50"
      >
        {getButtonText()}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SessionButton;
