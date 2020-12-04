import { IChannel } from "../../../app/schema/interface/IChannel";
import { IUser } from "../../../app/schema/interface/IUser";
import { IPlaylist } from "../../../app/schema/interface/IPlaylist";
import User from "../../../app/models/User";
import Playlist from "../../../app/models/Playlist";
import hash from "../../../app/helpers/hash";
import server from "../../../index";
import Channel from "../../../app/models/Channel";
import mongoose from "mongoose";
import request from "supertest";

describe("createPlaylist", () => {
  let user: IUser;
  let channel: IChannel;
  let name: string;
  let token: string;

  const exec = () => {
    return request(server)
      .post("/api/studio/playlists")
      .set("x-auth-token", token)
      .send({
        name,
      });
  };

  beforeEach(async () => {
    name = "playlist name";

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
    await Playlist.remove({});
    await Channel.remove({});
    await server.close();
  });

  it("should return 400 if name is not set", async () => {
    name = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if name is less than 3", async () => {
    name = "aa";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if name is more than 30", async () => {
    name = new Array(31).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if name is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should create playlist in database", async () => {
    await exec();

    const playlist = <IPlaylist>await Playlist.findOne({
      channelId: channel._id,
      name,
    });

    expect(playlist).not.toBeNull();
  });

  it("should return created playlist object", async () => {
    const res = await exec();

    expect(res.body.name).toBe(name);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("channelId");
  });
});
