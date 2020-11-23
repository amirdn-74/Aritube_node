import { IChannel } from "../app/schema/interface/IChannel";
import { IUser } from "../app/schema/interface/IUser";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      channel: IChannel;
    }
  }
}
