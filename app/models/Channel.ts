import mongoose from "mongoose";
import { IChannel } from "../schema/interface/IChannel";
import channelSchema from "../schema/model/channel.modelSchema";
import Playlist from "./Playlist";

class Channel
  extends mongoose.model("Channel", channelSchema)
  implements IChannel {
  public createPlaylist(name: string) {
    return Playlist.create({
      name,
      channelId: this._id,
    });
  }
}

export default Channel;
