import { NextFunction, Request, Response } from "express";
import validation from "../../helpers/validation";
import createChannelValidationSchema from "../../schema/validation/createChannel.validationSchema";

export const createChannelValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = await validation(req.body, createChannelValidationSchema(req));
  if (errors) return res.status(400).send(errors.inner);

  next();
};
