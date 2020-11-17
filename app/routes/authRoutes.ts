import express from "express";
import LoginController from "../controllers/Auth/LoginController";
import RegisterController from "../controllers/Auth/RegisterController";
import UserController from "../controllers/Auth/UserController";
import authenticate from "../middlewares/auth.middleware";
import loginValidation from "../middlewares/validations/login.validation";
import registerValidation from "../middlewares/validations/register.validation";
const route = express.Router();

route.post("/register", registerValidation, RegisterController.register);
route.post("/login", loginValidation, LoginController.login);
route.delete("/logout", authenticate, LoginController.logout);
route.get("/me", authenticate, UserController.me);

export default route;
