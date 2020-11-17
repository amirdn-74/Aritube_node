import { NextFunction, Request, Response } from "express";
import validation from "../../helpers/validation";
import registerValidationSchema from "../../schema/validation/register.validationSchema";

const registerValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = await validation(req.body, registerValidationSchema);

  if (errors) return res.status(400).send(errors.inner);

  next();
};

export default registerValidator;
