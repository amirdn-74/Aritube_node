import mongoose from "mongoose";
import hash from "../helpers/hash";
import JsonWebToken from "./JsonWebToken";
import jwt from "jsonwebtoken";
import _ from "lodash";
import userSchema from "../schema/model/user.modelSchema";
import { IUser } from "../schema/interface/IUser";
import Channel from "./Channel";
import { IChannel } from "../schema/interface/IChannel";

class User extends mongoose.model("User", userSchema) implements IUser {
  static async generateUser(user: any) {
    return this.create({
      name: user.name,
      email: user.email,
      password: await hash.generate(user.password),
    });
  }

  static getUserByEmail(email: string) {
    return this.findOne({ email });
  }

  public async generateAuthToken() {
    const token = await jwt.sign({ id: this._id }, "hello world");
    await JsonWebToken.create({
      userId: this._id,
      token,
    });

    return token;
  }

  public async createChannel(name: string) {
    await this.setHasChannel(true);

    return await Channel.create({
      userId: this._id,
      name,
    });
  }

  public async channel() {
    return <IChannel>await Channel.findOne({ userId: this._id });
  }

  private setHasChannel(state: boolean): void {
    const user = <IUser>(<unknown>this);
    user.hasChannel = state;
    user.save();
  }

  public async logout(token: string) {
    await JsonWebToken.findOneAndRemove({
      token,
      userId: this._id,
    });
  }
}

export default User;
