import { Router } from "express";
import * as notificationController from "./notification.controller.js";
import { Auth, authorize } from "../../Middleware/Auth/Auth.js";

const notificationRouter = Router();



// Get all User Notifications
notificationRouter.get("/getMyNotifications",Auth, notificationController.getMyNotifications);

// Mark Notification as read
notificationRouter.patch("/read-all",Auth, notificationController.markAsRead);

// Change Deal Status
notificationRouter.patch("/status/:notificationId",Auth, notificationController.updateDealStatus);

export default notificationRouter;