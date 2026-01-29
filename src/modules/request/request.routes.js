import { Router } from "express";
import * as requestController from "./request.controller.js";
import { Auth } from "../../Middleware/Auth/Auth.js";

const RequestRouter = Router();



// Create new Request ==> (Any User Can use this)
RequestRouter.post("/createRequest",Auth, requestController.createRequest);

// Get all Requests ==> (Any User Can use this)
RequestRouter.get("/getAllRequests",Auth, requestController.getAllRequests);

//Update Specific Request  ==> (Only admins can use this)
RequestRouter.patch("/updateRequest/:id",Auth , requestController.updateRequest);

// 4. Delete Request ==> (Only admins can use this)
RequestRouter.delete("/deleteRequest/:id",Auth, requestController.deleteRequest);

export default RequestRouter;