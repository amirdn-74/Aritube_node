import express from "express";
import ChannelsController from "../controllers/ChannelsController";
import authenticate from "../middlewares/auth.middleware";
import { createChannelValidation } from "../middlewares/validations/channel.validation";
const route = express.Router();

route.get("/:id", ChannelsController.show);
route.post(
  "/",
  authenticate,
  createChannelValidation,
  ChannelsController.create
);

export default route;
