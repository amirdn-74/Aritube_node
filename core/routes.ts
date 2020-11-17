import { Application } from "express";
import auth from "../app/routes/authRoutes";
import channel from "../app/routes/channelRoutes";

const routes = (app: Application) => {
  app.use("/api/auth", auth);
  app.use("/api/channel", channel);
};

export default routes;
