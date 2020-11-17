import { Request, Response } from "express";
import Channel from "../models/Channel";
import mongoose from "mongoose";

class ChannelsController {
  public async show(req: Request, res: Response) {
    try {
      const id = mongoose.Types.ObjectId(req.params.id);

      const channel = await Channel.findOne({ _id: id });
      if (!channel) return res.status(404).send("channel not found!");

      res.send(channel);
    } catch (error) {
      res.status(404).send("channel not found!");
    }
  }

  public async create(req: Request, res: Response) {
    const channel = await req.user.createChannel(req.body.name);

    res.send(channel);
  }
}

export default new ChannelsController();
