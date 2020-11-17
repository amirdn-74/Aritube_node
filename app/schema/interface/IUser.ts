import mongoose from "mongoose";
import { IChannel } from "./IChannel";

export interface IUser extends mongoose.Document {
  name?: string;
  email?: string;
  password?: string;
  hasChannel?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  generateAuthToken(): Promise<string>;
  createChannel(name: string): Promise<IChannel>;
  channel(): Promise<IChannel>;
  logout(token: string): void;
}
