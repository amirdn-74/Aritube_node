import Channel from "../../../app/models/Channel";
import JsonWebToken from "../../../app/models/JsonWebToken";
import User from "../../../app/models/User";
import { IChannel } from "../../../app/schema/interface/IChannel";
import { IUser } from "../../../app/schema/interface/IUser";
import server from "../../../index";
import request from "supertest";
import mongoose from "mongoose";
import { string } from "yup";

describe("getChannel", () => {
  let user: IUser;
  let channel: IChannel;
  let name: string;
  let channelId: mongoose.Types.ObjectId | string;

  const exec = () => {
    return request(server).get("/api/channel/" + channelId);
  };

  beforeEach(async () => {
    name = "channel name";

    user = <IUser>await User.generateUser({
      name: "12345",
      email: "a@a.a",
      password: "123456",
    });

    channel = <IChannel>await Channel.create({
      name,
      userId: user._id,
    });

    channelId = channel._id;
  });

  afterEach(async () => {
    await server.close();
    await User.remove({});
    await JsonWebToken.remove({});
    await Channel.remove({});
  });

  it("should return 404 if channel with given id is not exists", async () => {
    channelId = new mongoose.Types.ObjectId();
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 404 if the given id is not a valid ObjectId", async () => {
    channelId = "5";
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 200 if channel id is correct", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should return channel object", async () => {
    const res = await exec();

    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("userId");
  });
});
