import { IChannel } from "../app/schema/interface/IChannel";
import { IPlaylist } from "../app/schema/interface/IPlaylist";
import { IUser } from "../app/schema/interface/IUser";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      channel: IChannel;
      playlist: IPlaylist;
    }
  }
}
