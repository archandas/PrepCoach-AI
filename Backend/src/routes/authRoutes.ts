import {Router} from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

//user register route
authRouter.post("/register", authController.registerUserController);

//user login route
authRouter.post("/login", authController.loginUserController);

//user logout route
authRouter.get("/logout", authController.logoutUserController);

//user get-me route
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);

export default authRouter;