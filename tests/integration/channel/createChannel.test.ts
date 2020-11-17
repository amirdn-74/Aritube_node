import JsonWebToken from "../../../app/models/JsonWebToken";
import User from "../../../app/models/User";
import { IUser } from "../../../app/schema/interface/IUser";
import server from "../../../index";
import request from "supertest";
import Channel from "../../../app/models/Channel";
import { IChannel } from "../../../app/schema/interface/IChannel";
import mongoose from "mongoose";

describe("create channel", () => {
  let user: IUser;
  let channel: IChannel;
  let token: string;
  let name: string;

  const exec = () => {
    return request(server)
      .post("/api/channel")
      .set("x-auth-token", token)
      .send({
        name,
      });
  };

  beforeEach(async () => {
    name = "channel name";

    user = <IUser>await User.generateUser({
      name: "12345",
      email: "a@a.a",
      password: "123456",
    });

    token = await user.generateAuthToken();

    channel = <IChannel>await Channel.create({
      name,
      userId: user._id,
    });
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
    await JsonWebToken.remove({});
    await Channel.remove({});
  });

  it("should return 401 if user is not loged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if name is not set", async () => {
    name = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if name is less than 3 characters", async () => {
    name = "aa";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if name is more than 30 characters", async () => {
    name = new Array(31).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if user already have channel", async () => {
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if channel name is already taken", async () => {
    const newUserId = new mongoose.Types.ObjectId();
    await Channel.updateOne({ userId: user._id }, { userId: newUserId });

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if every thing is Ok", async () => {
    await Channel.remove({});

    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should create channel with the given data has been created", async () => {
    await Channel.remove({});
    await exec();

    const finalChannel = <IChannel>(
      await Channel.findOne({ userId: user._id, name })
    );

    expect(finalChannel).not.toBeNull();
    expect(finalChannel.userId.toString()).toBe(user._id.toString());
    expect(finalChannel.name).toBe(name);
  });

  it("should update 'hasChannel' propery in user to true", async () => {
    await Channel.remove({});
    await exec();

    await Channel.findOne({ userId: user._id, name });
    const updatedUser = <IUser>await User.findById(user._id);

    expect(updatedUser.hasChannel).toBe(true);
  });

  it("should return created channel object", async () => {
    await Channel.remove({});
    const res = await exec();

    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("userId");
  });
});
