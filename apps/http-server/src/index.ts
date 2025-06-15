import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/JWT_SECRET";
import middleware from "./middleware";
import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt"

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) : Promise<any> => {
  const { name, username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword
      },
    });

    return res.status(201).json({
      user: user,
      message: "user created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.post("/signin", async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
        where:{
            username
        }
    })
    if(!user){
        return res.status(403).json({"message": "Incorrect Inputs"})
    }


    const correctPassword = bcrypt.compare(password, user.password)
    if(!correctPassword){
        return res.status(403).json({"message": "wrong password"})
    }

    const token = jwt.sign({id:user.id}, JWT_SECRET)
    res.status(200).json({
        token,
        "message": "signin successful"
    })

})

app.post("/room", middleware, (req, res) => {

    res.json({
    roomId: 1,
  });
})

app.listen(8000, () => {
  console.log("server started");
});
