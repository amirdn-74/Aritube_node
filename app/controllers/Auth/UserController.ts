import { Request, Response } from "express";

class UserController {
  public async me(req: Request, res: Response) {
    res.send(req.user);
  }
}

export default new UserController();
