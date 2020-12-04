import { Request, Response } from "express";
import Playlist from "../models/Playlist";
import { IPlaylist } from "../schema/interface/IPlaylist";

class PlaylistsController {
  public async index(req: Request, res: Response) {
    const playlists = await Playlist.find({ channelId: req.channel._id });
    res.send(playlists);
  }

  public async create(req: Request, res: Response) {
    const playlist = <IPlaylist>await req.channel.createPlaylist(req.body.name);

    res.send(playlist);
  }

  public async update(req: Request, res: Response) {
    req.playlist.name = req.body.name;
    const playlist = await req.playlist.save();

    res.send(playlist);
  }

  public async destroy(req: Request, res: Response) {
    await Playlist.deleteMany({ _id: { $in: req.body.playlists } });

    res.send();
  }
}

export default new PlaylistsController();
