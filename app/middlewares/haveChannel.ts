import { NextFunction, Request, Response } from "express";

const haveChannel = async (req: Request, res: Response, next: NextFunction) => {
  const channel = await req.user.channel();
  if (!channel) return res.status(403).send("Access Denied!");

  req.channel = channel;
  next();
};

export default haveChannel;
