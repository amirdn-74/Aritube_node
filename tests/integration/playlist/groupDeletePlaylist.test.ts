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

describe("getPlaylists", () => {
  let user: IUser;
  let channel: IChannel;
  let token: string;
  let playlists: object[];
  let createdPlaylists: IPlaylist[];
  let playlistIds: string[];

  const exec = () => {
    return request(server)
      .delete("/api/studio/playlists")
      .set("x-auth-token", token)
      .send({ playlists: playlistIds });
  };

  beforeEach(async () => {
    user = <IUser>await User.create({
      name: "aaaaa",
      email: "a@a.a",
      password: await hash.generate("123456"),
    });
    token = await user.generateAuthToken();

    channel = <IChannel>await user.createChannel("channelName");

    playlists = [
      { name: "playlist1", channelId: channel._id },
      { name: "playlist2", channelId: channel._id },
      { name: "playlist3", channelId: channel._id },
      { name: "playlist4", channelId: channel._id },
    ];

    playlistIds = [];
    createdPlaylists = await Playlist.insertMany(playlists);
    createdPlaylists.forEach((pl) => playlistIds.push(pl._id));
  });

  afterEach(async () => {
    await User.remove({});
    await Playlist.remove({});
    await Channel.remove({});
    await server.close();
  });

  it("should return 400 if playlistIds is empty", async () => {
    playlistIds = [];
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if playlistIds is empty", async () => {
    playlistIds = [];
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if playlistIds has an invalid member", async () => {
    playlistIds.push("a");
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if playlistIds is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should return delete requested Items", async () => {
    const res = await exec();

    const checked = await Playlist.find({ _id: { $in: playlistIds } });

    expect(checked.length).toBe(0);
  });

  it("should be good if there is an id that is not exists in db", async () => {
    playlistIds.push(new mongoose.Types.ObjectId().toHexString());
    await exec();

    const checked = await Playlist.find({ _id: { $in: playlistIds } });

    expect(checked.length).toBe(0);
  });
});
