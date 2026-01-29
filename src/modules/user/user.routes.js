import { Router } from "express";
import * as userController from "./user.controller.js";
import { Auth, authorize } from "../../Middleware/Auth/Auth.js";

const UserRouter = Router();


UserRouter.post("/register", userController.Register); //Done
UserRouter.post("/login", userController.Login);//Done
UserRouter.post("/forget-password", userController.ForgetPassWord);//Done
UserRouter.post("/check-reset-code", userController.CheckResetCode);//Done
UserRouter.patch("/reset-password", userController.ResetPassword);//Done


UserRouter.get("/profile",Auth, userController.getMyProfile);
UserRouter.patch("/update-profile",Auth, userController.updateProfile);//Done
UserRouter.delete("/delete-profile",Auth, userController.DeleteProfile);//Done

// --- For (Admins Only) ---
UserRouter.patch("/change-role",Auth, authorize("Admin"),  userController.ChangeUserRole);//Done

export default UserRouter;