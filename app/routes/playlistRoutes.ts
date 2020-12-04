import express from "express";
import PlaylistsController from "../controllers/PlaylistsController";
import authenticate from "../middlewares/auth.middleware";
import haveChannel from "../middlewares/haveChannel";
import {
  createPlaylistValidation,
  deletePlaylistValidation,
  updatePlaylistValidation,
} from "../middlewares/validations/playlist.vlidation";
const route = express.Router();

route.get("/", authenticate, haveChannel, PlaylistsController.index);
route.post(
  "/",
  authenticate,
  haveChannel,
  createPlaylistValidation,
  PlaylistsController.create
);
route.put(
  "/:id",
  authenticate,
  haveChannel,
  updatePlaylistValidation,
  PlaylistsController.update
);
route.delete(
  "/",
  authenticate,
  haveChannel,
  deletePlaylistValidation,
  PlaylistsController.destroy
);

export default route;
