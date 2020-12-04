import mongoose from "mongoose";

export interface IPlaylist extends mongoose.Document {
  name?: string;
  cover?: string;
  videoCount?: number;
  channelId?: mongoose.Types.ObjectId;
}
