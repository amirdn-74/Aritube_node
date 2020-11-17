import mongoose from "mongoose";
import { IChannel } from "../schema/interface/IChannel";
import channelSchema from "../schema/model/channel.modelSchema";

class Channel
  extends mongoose.model("Channel", channelSchema)
  implements IChannel {
  //
}

export default Channel;
