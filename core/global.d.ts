import { IUser } from "../app/schema/interface/IUser";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
