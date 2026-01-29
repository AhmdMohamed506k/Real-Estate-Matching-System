import { Router } from "express";
import * as offerController from "./offer.controller.js";
import { Auth, authorize } from "../../Middleware/Auth/Auth.js";

const OfferRouter = Router();



//Add new offer (All Users can use it)
OfferRouter.post("/createOffer",  Auth,  offerController.createOffer);

// Get All offer (All Users can use it)
OfferRouter.get("/getAllOffers", offerController.getAllOffers);

//Get specific Offer (All Users can use it)
OfferRouter.get("getOfferById/:id", offerController.getOfferById);

// Update Offer (only admins can you it)
OfferRouter.patch( "updateOffer/:id",  Auth,  offerController.updateOffer);

// Delete Offer (only admins can you it)
OfferRouter.delete("deleteOffer/:id",  Auth,  offerController.deleteOffer);



export default OfferRouter;