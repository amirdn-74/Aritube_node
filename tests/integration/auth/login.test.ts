import User from "../../../app/models/User";
import mongoose from "mongoose";
import server from "../../../index";
import request from "supertest";
import hash from "../../../app/helpers/hash";
import JsonWebToken from "../../../app/models/JsonWebToken";
import { IJsonWebToken } from "../../../app/schema/interface/IJsonWebToken";

describe("login", () => {
  let user: mongoose.Document;
  let name: string;
  let email: string;
  let password: string;

  const exec = async () => {
    return request(server).post("/api/auth/login").send({
      email,
      password,
    });
  };

  beforeEach(async () => {
    name = "aaaaa";
    email = "a@a.a";
    password = "123456";

    user = await User.create({
      name,
      email,
      password: await hash.generate(password),
    });
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  it("should return 400 if email is not passed", async () => {
    email = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if email is not valid", async () => {
    email = "a";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if there is no user with this email", async () => {
    email = "b@b.b";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is not set", async () => {
    password = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is wrong", async () => {
    password = "123";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if all things are correct", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set a jwt for current user", async () => {
    await exec();

    const jwt = <IJsonWebToken>await JsonWebToken.findOne({ userId: user._id });

    expect(jwt).not.toBeNull();
    expect(jwt.userId!.toString()).toBe(user._id.toString());
    expect(jwt.token!.toString()).not.toBeFalsy();
  });

  it("should return the jwt to user", async () => {
    const res = await exec();

    expect(res.body).not.toBeNull();
    expect(res.body.token.toString()).not.toBeFalsy();
  });
});
