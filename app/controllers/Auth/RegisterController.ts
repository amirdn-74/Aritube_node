import { Request, Response } from "express";
import User from "../../models/User";
import _ from "lodash";
import { IUser } from "../../schema/interface/IUser";

class RegisterController {
  public async register(req: Request, res: Response) {
    const user = <IUser>await User.generateUser(req.body);

    return res.send(_.pick(user, ["_id", "name", "email"]));
  }
}

export default new RegisterController();
