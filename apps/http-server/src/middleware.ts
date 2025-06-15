import { JWT_SECRET } from "@repo/backend-common/JWT_SECRET";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const token = req.body();

  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded) {
    return null;
  }
  
  next();
}
