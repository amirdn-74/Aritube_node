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
  let about: string;

  const exec = () => {
    return request(server)
      .put(`/api/channel/my/about`)
      .set("x-auth-token", token)
      .send({
        about,
      });
  };

  beforeEach(async () => {
    about = "lorem ipsom and more";

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

  it("should return 400 if about is not set", async () => {
    about = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if about is more than 200", async () => {
    about = new Array(201).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should update channel collection in database", async () => {
    await exec();

    const updatedChannel = <IChannel>await Channel.findById(channel._id);

    expect(updatedChannel.about).toBe(about);
  });

  it("should return updated channel object", async () => {
    const res = await exec();

    expect(res.body.about).toBe(about);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("subscriber");
  });
});
