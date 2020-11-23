import server from "../../../index";
import request from "supertest";
import { IUser } from "../../../app/schema/interface/IUser";
import { IChannel } from "../../../app/schema/interface/IChannel";
import User from "../../../app/models/User";
import hash from "../../../app/helpers/hash";
import JsonWebToken from "../../../app/models/JsonWebToken";
import Channel from "../../../app/models/Channel";

describe("change channel name", () => {
  let user: IUser;
  let channel: IChannel;
  let token: string;

  const exec = () => {
    return request(server).get(`/api/channel/my`).set("x-auth-token", token);
  };

  beforeEach(async () => {
    user = <IUser>await User.create({
      name: "aaaaa",
      email: "a@a.a",
      password: await hash.generate("123456"),
    });

    token = await user.generateAuthToken();

    channel = <IChannel>await user.createChannel("channelName");
  });

  afterEach(async () => {
    await User.remove({});
    await JsonWebToken.remove({});
    await Channel.remove({});
    await server.close();
  });

  it("should return 401 if user is not loged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 403 if user has no channel", async () => {
    channel.remove();
    const res = await exec();

    expect(res.status).toBe(403);
  });

  it("should return 200 if every thing is ok", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should return channel object for given user", async () => {
    const res = await exec();

    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("subscriber");
    expect(res.body.userId.toString()).toBe(user._id.toString());
  });
});
