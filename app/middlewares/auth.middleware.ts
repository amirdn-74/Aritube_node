import { NextFunction, Request, Response } from "express";
import JsonWebToken from "../models/JsonWebToken";
import { IJsonWebToken } from "../schema/interface/IJsonWebToken";
import { IUser } from "../schema/interface/IUser";
import jwt from "jsonwebtoken";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sentToken = req.get("x-auth-token");
  if (!sentToken) return res.status(401).send("unuthorized");

  try {
    jwt.verify(sentToken, "hello world");

    const token = <IJsonWebToken>(
      await JsonWebToken.findOne({ token: sentToken })
    );
    if (!token) return res.status(401).send("unuthorized");

    const user = <IUser>await token.getUser();
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).send("unuthorized");
  }
};

export default authenticate;
