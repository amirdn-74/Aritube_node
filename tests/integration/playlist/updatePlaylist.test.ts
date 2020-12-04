import { IChannel } from "../../../app/schema/interface/IChannel";
import { IUser } from "../../../app/schema/interface/IUser";
import { IPlaylist } from "../../../app/schema/interface/IPlaylist";
import User from "../../../app/models/User";
import Playlist from "../../../app/models/Playlist";
import hash from "../../../app/helpers/hash";
import server from "../../../index";
import Channel from "../../../app/models/Channel";
import request from "supertest";
import mongoose from "mongoose";

describe("createPlaylist", () => {
  let user: IUser;
  let channel: IChannel;
  let name: string;
  let token: string;
  let playlist: IPlaylist;
  let playlistId: mongoose.Types.ObjectId | string;

  const exec = () => {
    return request(server)
      .put("/api/studio/playlists/" + playlistId)
      .set("x-auth-token", token)
      .send({
        name,
      });
  };

  beforeEach(async () => {
    name = "changed name";

    user = <IUser>await User.create({
      name: "aaaaa",
      email: "a@a.a",
      password: await hash.generate("123456"),
    });

    token = await user.generateAuthToken();

    channel = <IChannel>await user.createChannel("channelName");

    playlist = await Playlist.create({
      name: "playlist",
      channelId: channel._id,
    });
    playlistId = playlist._id;
  });

  afterEach(async () => {
    await User.remove({});
    await Playlist.remove({});
    await Channel.remove({});
    await server.close();
  });

  it("should return 404 if playlist id is not set", async () => {
    playlistId = "";
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 404 if playlist id is not valid ObjectId", async () => {
    playlistId = "a";
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 404 if playlist id is valid ObjectId bt not exists in db", async () => {
    playlistId = new mongoose.Types.ObjectId();
    const res = await exec();

    expect(res.status).toBe(404);
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

  it("should update playlist in database", async () => {
    await exec();

    const newPlaylist = <IPlaylist>await Playlist.findById(playlist._id);

    expect(newPlaylist.name).toBe(name);
  });

  it("should return update playlist object", async () => {
    const res = await exec();

    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("channelId");
  });
});
