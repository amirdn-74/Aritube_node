import { IChannel } from "../../../app/schema/interface/IChannel";
import { IUser } from "../../../app/schema/interface/IUser";
import { IPlaylist } from "../../../app/schema/interface/IPlaylist";
import User from "../../../app/models/User";
import Playlist from "../../../app/models/Playlist";
import hash from "../../../app/helpers/hash";
import server from "../../../index";
import Channel from "../../../app/models/Channel";
import request from "supertest";

describe("getPlaylists", () => {
  let user: IUser;
  let channel: IChannel;
  let token: string;
  let playlist: IPlaylist;

  const exec = () => {
    return request(server)
      .get("/api/studio/playlists")
      .set("x-auth-token", token);
  };

  beforeEach(async () => {
    user = <IUser>await User.create({
      name: "aaaaa",
      email: "a@a.a",
      password: await hash.generate("123456"),
    });
    token = await user.generateAuthToken();

    channel = <IChannel>await user.createChannel("channelName");

    playlist = <IPlaylist>await Playlist.create({
      name: "playlistName",
      channelId: channel._id,
    });
  });

  afterEach(async () => {
    await User.remove({});
    await Playlist.remove({});
    await Channel.remove({});
    await server.close();
  });

  it("should return 200 status", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should return channel's playlists list", async () => {
    const res = await exec();

    res.body.forEach((playlist) => {
      expect(playlist).toHaveProperty("name");
      expect(playlist).toHaveProperty("channelId");
    });
  });
});
