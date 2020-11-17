import mongoose from "mongoose";

export interface IChannel extends mongoose.Document {
  name?: string;
  userId?: mongoose.Types.ObjectId;
  banner?: string;
  subscriber?: number;
  createdAt?: Date;
  updatedAt?: Date;
}