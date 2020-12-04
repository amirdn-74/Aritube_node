import mongoose from "mongoose";
import { IPlaylist } from "../schema/interface/IPlaylist";
import playlistSchema from "../schema/model/playlist.modelSchema";

class Playlist
  extends mongoose.model("Playlist", playlistSchema)
  implements IPlaylist {
  //
}

export default Playlist;
