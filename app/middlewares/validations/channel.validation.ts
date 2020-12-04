import { NextFunction, Request, Response } from "express";
import validation, { makeValidationError } from "../../helpers/validation";
import createChannelValidationSchema from "../../schema/validation/createChannel.validationSchema";
import updateChannelNameValidatioSchema from "../../schema/validation/updateChannelName.validationSchema";
import updateChannelAboutValidationSchema from "../../schema/validation/updateChannelAbout.validationSchemal";
import mongoose from "mongoose";
import { IChannel } from "../../schema/interface/IChannel";
import Channel from "../../models/Channel";
import upload from "../../helpers/upload";
import env from "../../../core/env";

export const createChannelValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = await validation(req.body, createChannelValidationSchema(req));
  if (errors) return res.status(400).send(errors.inner);

  next();
};

export const updateChannelNameValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = await validation(
    req.body,
    updateChannelNameValidatioSchema(req)
  );
  if (errors) return res.status(400).send(errors.inner);

  next();
};

export const updateChannelProfileValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const doUpload = upload({
    destination:
      env("NODE") === "test" ? "./public/tests/channel" : "./public/channel",
    fileSize: 1048576, // 1MB
    validTypes: ["image/jpg", "image/jpeg", "image/png"],
  }).single("profilePicture");

  doUpload(req, res, async (er: any) => {
    if (er) return res.status(400).send(makeValidationError(er).inner);
    if (!req.body.profilePicture && !req.file) {
      const errors = makeValidationError({
        field: "profilePicture",
        message: "profile picture is required",
      }).inner;

      return res.status(400).send(errors);
    }

    next();
  });
};

export const updateChannelBannerValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const doUpload = upload({
    destination:
      env("NODE") === "test" ? "./public/tests/channel" : "./public/channel",
    fileSize: 1048576, // 1MB
    validTypes: ["image/jpg", "image/jpeg", "image/png"],
  }).single("bannerPicture");

  doUpload(req, res, async (err: any) => {
    if (err) return res.status(400).send(makeValidationError(err).inner);
    if (!req.body.bannerPicture && !req.file) {
      return res.status(400).send(
        makeValidationError({
          field: "bannerPicture",
          message: "banner message is required",
        }).inner
      );
    }

    next();
  });
};

export const updateChannelAboutValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = await validation(
    req.body,
    updateChannelAboutValidationSchema()
  );
  if (errors) return res.status(400).send(errors.inner);

  next();
};
