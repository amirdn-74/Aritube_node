import { NextFunction, Request, Response } from "express";
import validation from "../../helpers/validation";
import loginValidationSchema from "../../schema/validation/login.validationSchema";

const loginValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = await validation(req.body, loginValidationSchema);

  if (errors) return res.status(400).send(errors.inner);

  next();
};

export default loginValidator;
