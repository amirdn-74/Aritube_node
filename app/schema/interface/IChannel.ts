import mongoose from "mongoose";
import { IPlaylist } from "./IPlaylist";

export interface IChannel extends mongoose.Document {
  name?: string;
  userId?: mongoose.Types.ObjectId;
  banner?: string;
  profile?: string;
  about?: string;
  subscriber?: number;
  createdAt?: Date;
  updatedAt?: Date;

  createPlaylist(name: string): Promise<IPlaylist>;
}
