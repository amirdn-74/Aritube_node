import { Application } from "express";
import auth from "../app/routes/authRoutes";
import channel from "../app/routes/channelRoutes";
import playlist from "../app/routes/playlistRoutes";

const routes = (app: Application) => {
  app.use("/api/auth", auth);
  app.use("/api/channel", channel);
  app.use("/api/studio/playlists", playlist);
};

export default routes;
