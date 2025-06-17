import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/JWT_SECRET";
import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  ws: WebSocket;
  rooms: string[];
}

const users: User[] = [];

function authUser(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      console.error("Decoded token is a string, expected object");
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
  return null;
}

wss.on("connection", (ws, Request) => {
  const url = Request.url;
  if (!url) {
    ws.close();
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    ws.close();
    return;
  }
  console.log("code working");

  const userId = authUser(token);

  if (userId == null) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    ws,
    rooms: [],
  });

  console.log("user connected...");
  console.log(users);
  ws.on("message", async (data) => {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    console.log(parsedData);

    if (parsedData.type === "join-room") {
      const user = users.find((x) => x.ws === ws);

      if (!user) {
        ws.close();
        return;
      }

      const checkRoomResponse = await prisma.room.findUnique({
        where: {
          name: parsedData.roomName,
        },
      });
      if (!checkRoomResponse) {
        console.log("no room");
        ws.close();
        return;
      }
      user.rooms.push(checkRoomResponse.id);
      console.log(user);
    }

    if (parsedData.type === "leave-room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        ws.close();
        return;
      }
      const room = await prisma.room.findUnique({
        where: {
          name: parsedData.name,
        },
      });
      if (!room) {
        console.error("No room exists");
        ws.close;
        return;
      }
      user.rooms = user.rooms.filter((x) => x === room.id);
    }

    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prisma.shape.create({
        data: {
          roomId,
          message,
          userId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId) && user.ws !== ws) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              roomId,
              message: message,
            })
          );
        }
      });
    }
  });
});
