import mongoose from "mongoose";
import { IUser } from "./IUser";

export interface IJsonWebToken extends mongoose.Document {
  userId?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;

  getUser(): Promise<IUser>;
}
