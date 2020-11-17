import { IUser } from "../../../app/schema/interface/IUser";
import request from "supertest";
import server from "../../../index";
import User from "../../../app/models/User";
import JsonWebToken from "../../../app/models/JsonWebToken";

describe("user", () => {
  let user: IUser;
  let token: string;

  const exec = () => {
    return request(server).get("/api/auth/me").set("x-auth-token", token);
  };

  beforeEach(async () => {
    user = <IUser>await User.generateUser({
      name: "amirdn",
      email: "a@a.a",
      password: "123456",
    });

    token = await user.generateAuthToken();
  });

  afterEach(async () => {
    await User.remove({});
    await JsonWebToken.remove({});
    await server.close();
  });

  it("should return 401 if auth token is not provided", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 401 if auth token is not correct", async () => {
    token = "a";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 200 if token is correct", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should return user object without password field", async () => {
    const res = await exec();

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("email");
    expect(res.body).not.toHaveProperty("password");
  });
});
