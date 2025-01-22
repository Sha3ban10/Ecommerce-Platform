import { Router } from "express";
import * as user from "./auth.controller.js";
import userValidation from "./auth.validation.js";
import { validation } from "../../MiddleWares/validation.js";
import { auth } from "../../MiddleWares/auth.js";

export const userRouter = Router();

userRouter.post("/signup", validation(userValidation.signUp), user.signUp);
userRouter.get("/verify/:token", user.verifyMail);
userRouter.get("/refresh/:reftoken", user.refreshMail);
userRouter.put("/forgetpassword", user.forgetPassword);
userRouter.put("/resetpassword", user.resetPassword);
userRouter.put(
  "/makeAdmin",
  auth("admin"),
  validation(userValidation.makeAdmin),
  user.makeAdmin
);
userRouter.post("/signin", validation(userValidation.signIn), user.signIn);
export default userRouter;
