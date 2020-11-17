import mongoose from "mongoose";
import request from "supertest";
import User from "../../../app/models/User";
import { IUser } from "../../../app/schema/interface/IUser";
import server from "../../../index";

describe("register", () => {
  let name: string;
  let email: string;
  let password: string;
  let confirmPassword: string;

  const exec = () => {
    return request(server).post("/api/auth/register").send({
      name,
      email,
      password,
      confirmPassword,
    });
  };
  let user: mongoose.Document;

  beforeEach(async () => {
    name = "aaaaa";
    email = "a@a.c";
    password = "123456";
    confirmPassword = "123456";

    user = await User.create({
      name,
      email,
      password,
    });
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
  });

  it("should return 400 if name is not set", async () => {
    name = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if name is less than 5", async () => {
    name = "amir";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if name is more than 50", async () => {
    name = new Array(52).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if email is not set", async () => {
    email = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if email is not valid", async () => {
    email = "a";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if email is already taken", async () => {
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is not set", async () => {
    email = "e@e.e";
    password = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is less than 6", async () => {
    email = "c@c.c";
    password = "1234";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is more than 60", async () => {
    email = "f@c.c";
    password = new Array(61).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if confirm password is not set", async () => {
    email = "r@c.c";
    confirmPassword = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if confirm password is match to password", async () => {
    email = "t@c.c";
    confirmPassword = "1234567";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if this is a valid request", async () => {
    name = "amirdn";
    email = "n@c.c";
    confirmPassword = "123456";

    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set a user object", async () => {
    email = "k@c.c";

    await exec();

    const userCheck = <IUser>await User.findOne({ email });

    expect(userCheck).not.toBeNull();
    expect(userCheck.email).toBe(email);
  });

  it("should hashed password", async () => {
    email = "l@c.c";

    await exec();

    const userCheck: IUser = <IUser>await User.findOne({ email });

    expect(userCheck.password).not.toBeNull();
    expect(userCheck.password).not.toBe(password);
  });

  it("should return user object without password field", async () => {
    email = "o@c.c";

    const res = await exec();

    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("email");
    expect(res.body).not.toHaveProperty("password");
  });
});
