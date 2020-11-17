import mongoose from "mongoose";
import { IJsonWebToken } from "../schema/interface/IJsonWebToken";
import { IUser } from "../schema/interface/IUser";
import jsonWebTokenSchema from "../schema/model/jsonWebToken.modelSchema";
import User from "./User";

class JsonWebToken
  extends mongoose.model<IJsonWebToken>("JsonWebToken", jsonWebTokenSchema)
  implements IJsonWebToken {
  public async getUser() {
    return <IUser>await User.findById(this.userId!).select("-password");
  }
}

export default JsonWebToken;
