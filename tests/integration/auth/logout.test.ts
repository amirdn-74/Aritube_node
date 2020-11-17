import server from "../../../index";
import User from "../../../app/models/User";
import hash from "../../../app/helpers/hash";
import request from "supertest";
import JsonWebToken from "../../../app/models/JsonWebToken";
import { IUser } from "../../../app/schema/interface/IUser";
import jwt from "jsonwebtoken";

describe("logout", () => {
  let user: IUser;
  let token: string;
  let name: string;
  let email: string;
  let password: string;

  const exec = async () => {
    return request(server)
      .delete("/api/auth/logout")
      .set("x-auth-token", token);
  };

  beforeEach(async () => {
    name = "aaaaa";
    email = "a@a.a";
    password = "123456";

    user = <IUser>await User.create({
      name,
      email,
      password: await hash.generate(password),
    });

    token = await user.generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
    await JsonWebToken.remove({});
  });

  it("should return 401 if token is not set", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 401 if token is invalid", async () => {
    token = "a";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 401 if token is invalid", async () => {
    token = jwt.sign({ id: "a" }, "hello world");
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 200 if request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should remove jwt from database", async () => {
    await exec();

    const jwt = await JsonWebToken.findOne({ token, userId: user._id });

    expect(jwt).toBeFalsy();
  });
});
