import { WebSocketServer} from "ws"
import jwt from "jsonwebtoken"
import { JWT_SECRET} from "@repo/backend-common/JWT_SECRET"

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, Request) => {
    const url = Request.url
    if(!url) {
        ws.close()
        return
    }
    const queryParams = new URLSearchParams(url.split('?')[1])
    const token = queryParams.get("token")
    if (!token){
        ws.close()
        return
    }
    console.log("code working")
    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded){
        ws.close()
    }

    console.log("user connected...")
    ws.on("message", (e) =>{
        if (e.toString() == "ping"){
            ws.send("pong")
        }
    })
})