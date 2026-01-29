import { Router } from "express";
import * as analyticsController from "./analytics.controller.js";
import { Auth, authorize } from "../../Middleware/Auth/Auth.js";

const analyticsRouter = Router();



analyticsRouter.get("/my-performance",Auth, analyticsController.getMyStats);

analyticsRouter.get("/admin-dashboard",Auth, authorize("Admin", "Manager"), analyticsController.getAdminStats);

export default analyticsRouter;