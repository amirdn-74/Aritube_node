import express from "express";
import ChannelsController from "../controllers/ChannelsController";
import authenticate from "../middlewares/auth.middleware";
import haveChannel from "../middlewares/haveChannel";
import {
  createChannelValidation,
  updateChannelAboutValidation,
  updateChannelBannerValidation,
  updateChannelNameValidation,
  updateChannelProfileValidation,
} from "../middlewares/validations/channel.validation";
const route = express.Router();

route.get("/my", authenticate, haveChannel, ChannelsController.getMyChannel);
route.get("/:id", ChannelsController.show);
route.post(
  "/",
  authenticate,
  createChannelValidation,
  ChannelsController.create
);
route.put(
  "/my/name",
  authenticate,
  haveChannel,
  updateChannelNameValidation,
  ChannelsController.updateName
);
route.put(
  "/my/profile",
  authenticate,
  haveChannel,
  updateChannelProfileValidation,
  ChannelsController.updateProfilePicture
);
route.put(
  "/my/banner",
  authenticate,
  haveChannel,
  updateChannelBannerValidation,
  ChannelsController.updateBannerPicture
);
route.put(
  "/my/about",
  authenticate,
  haveChannel,
  updateChannelAboutValidation,
  ChannelsController.updateAbout
);

export default route;
