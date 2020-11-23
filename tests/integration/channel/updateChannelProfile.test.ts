import server from "../../../index";
import request from "supertest";
import { IUser } from "../../../app/schema/interface/IUser";
import { IChannel } from "../../../app/schema/interface/IChannel";
import User from "../../../app/models/User";
import hash from "../../../app/helpers/hash";
import JsonWebToken from "../../../app/models/JsonWebToken";
import Channel from "../../../app/models/Channel";
import { clearDir } from "../../../app/helpers/upload";
import fs from "fs";

describe("change channel name", () => {
  let user: IUser;
  let channel: IChannel;
  let token: string;
  let image: string;

  const exec = () => {
    return request(server)
      .put(`/api/channel/my/profile`)
      .set("x-auth-token", token)
      .attach("profilePicture", image);
  };

  beforeEach(async () => {
    user = <IUser>await User.create({
      name: "aaaaa",
      email: "a@a.a",
      password: await hash.generate("123456"),
    });

    token = await user.generateAuthToken();

    channel = <IChannel>await user.createChannel("channelName");

    image = "./tests/files/cow.jpg";
  });

  afterEach(async () => {
    await User.remove({});
    await JsonWebToken.remove({});
    await Channel.remove({});
    await server.close();
    clearDir("./public/tests/channel");
  });

  it("should return 400 if image is not set", async () => {
    image = "";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body.inner[0].path).toBe("profilePicture");
  });

  it("should return 400 if file is not an image", async () => {
    image = "./tests/files/text.txt";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body.inner[0].path).toBe("profilePicture");
  });

  it("should return 400 if file size is more than 1mb", async () => {
    image = "./tests/files/big.jpg";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body.inner[0].path).toBe("profilePicture");
  });

  it("should return 200 if request is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should return updated channel object", async () => {
    const res = await exec();

    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("subscriber");
    expect(res.body).toHaveProperty("profile");
  });

  it("should update channel collection in db", async () => {
    await exec();

    const updatedChannel = <IChannel>await Channel.findById(channel._id);
    const now = Date.now();
    const fileName = +updatedChannel.profile.split(".")[0];
    expect(now - fileName).toBeLessThan(1000);
  });

  it("should upload image", async () => {
    const res = await exec();

    const fn = res.body.profile;

    fs.readdir("./public/tests/channel", (err, files) => {
      if (err) return console.log(err);
      expect(files.indexOf(fn)).not.toBe(-1);
    });
  });
});
