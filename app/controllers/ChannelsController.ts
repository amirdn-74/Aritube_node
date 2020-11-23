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

  public async getMyChannel(req: Request, res: Response) {
    res.send(req.channel);
  }

  public async updateName(req: Request, res: Response) {
    req.channel.name = req.body.channelName;
    await req.channel.save();

    res.send(req.channel);
  }

  public async updateProfilePicture(req: Request, res: Response) {
    req.channel.profile = req.file.filename;
    const updatedChannel = await req.channel.save();

    res.send(updatedChannel);
  }

  public async updateBannerPicture(req: Request, res: Response) {
    req.channel.banner = req.file.filename;
    const updatedChannel = await req.channel.save();

    res.send(updatedChannel);
  }

  public async updateAbout(req: Request, res: Response) {
    req.channel.about = req.body.about;
    const updated = await req.channel.save();

    res.send(updated);
  }
}

export default new ChannelsController();
