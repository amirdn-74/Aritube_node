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
  let channelName: string;
  let token: string;

  const exec = () => {
    return request(server)
      .put(`/api/channel/my/name`)
      .set("x-auth-token", token)
      .send({
        channelName,
      });
  };

  beforeEach(async () => {
    user = <IUser>await User.create({
      name: "aaaaa",
      email: "a@a.a",
      password: await hash.generate("123456"),
    });

    token = await user.generateAuthToken();

    channelName = "chname";
    channel = <IChannel>await user.createChannel(channelName);
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

  it("should return 400 if channel name is not set", async () => {
    channelName = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if channel name is less than 3", async () => {
    channelName = "a";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if channel name is more than 30", async () => {
    channelName = new Array(31).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if channel name is not unique", async () => {
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if every thing is OK", async () => {
    channelName = "new Name";
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should update channel name to new name", async () => {
    channelName = "new Name";
    await exec();

    const newChannel = <IChannel>await user.channel();

    expect(newChannel.name).toBe(channelName);
  });

  it("should return updated channel update", async () => {
    channelName = "new Name";
    const res = await exec();

    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("subscriber");
  });
});
