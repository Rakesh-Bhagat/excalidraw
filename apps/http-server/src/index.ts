import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/JWT_SECRET";
import middleware from "./middleware";
import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt"
import {createUserSchema, signinSchema} from "@repo/common/types"

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) : Promise<any> => {
  const parsedData = createUserSchema.safeParse(req.body);

  if(!parsedData.success){
    return res.status(401).json({
      message: "wrong inputs"
    })
  }


  const existingUser = await prisma.user.findUnique({
    where: {
      username: parsedData.data.username,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: parsedData.data.name,
        username: parsedData.data.username,
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
  const parsedData = signinSchema.safeParse(req.body);
  if(!parsedData.success){
    return res.json({message: "wrong Inputs"}).status(401)
  }

    const user = await prisma.user.findFirst({
        where:{
            username: parsedData.data?.username
        }
    })
    if(!user){
        return res.status(403).json({"message": "No User exists"})
    }


    const correctPassword = bcrypt.compare(parsedData.data.password, user.password)
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
