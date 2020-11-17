import { Request, Response } from "express";
import User from "../../models/User";
import { IUser } from "../../schema/interface/IUser";

class LoginController {
  public async login(req: Request, res: Response) {
    const user = <IUser>await User.getUserByEmail(req.body.email);

    const token = await user.generateAuthToken();

    res.send({ token });
  }

  public async logout(req: Request, res: Response) {
    await req.user.logout(<string>req.get("x-auth-token"));

    res.send();
  }
}

export default new LoginController();
