


import { offerModel } from "../../../DB/Models/Offer.model.js";
import ApiFeatures from "../../untils/ApiFeatures/ApiFeatures.js";
import {AsyncHandler} from "../../Middleware/AsyncHandler/AsyncHandler.js";
import redisClient from "../../untils/redisClient/RedisClient.js";
import { matchOfferWithRequests } from "../../untils/matchingEngine/matchingEngine.js";


// AddNewOffer ==> (Any User Can use this)
export const createOffer = AsyncHandler(async (req, res, next) => {
    
    const {  propertyType, category, status, city,  district, area, totalPrice, isExclusive } = req.body;

    const newOffer = await offerModel.create({ propertyType, category, status, city, district, area, totalPrice, isExclusive,  broker: req.user._id });

   
    matchOfferWithRequests(newOffer);

    res.status(201).json({ msg: "Offer Added successfully", offer: newOffer });
});
// GetAllOffers   ==> (Any User Can use this)
export const getAllOffers = AsyncHandler(async (req, res, next) => {

    // Caching Offers
    const cacheKey = `offers:${JSON.stringify(req.query)}`;


    
    // Check if Data Exist
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.status(200).json({ status: "success", source: "cache", data: JSON.parse(cachedData) });

    //If data doesn't Exist in cach Display New one 
    const features = new ApiFeatures(offerModel.find(), req.query).filter().sort().limitFields().paginate();
    if(features.length < 1){return res.status(400).json({msg:"no offers Available"})}
    const offers = await features.mongooseQuery;

    //save New data in cach
    await redisClient.set(cacheKey, JSON.stringify(offers), 'EX', 300);

    res.status(200).json({ status: "success", results: offers.length, data: offers });
});
//Get specific Offer By OfferID ==> (Any User Can use this)
export const getOfferById = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const cacheKey = `offer_detail:${id}`;

    //check if data is exist in cach
    const cachedOffer = await redisClient.get(cacheKey);
    if (cachedOffer) return res.status(200).json({ status: "success", source: "cache", data: JSON.parse(cachedOffer) });
    
    // Display data if it does't Exist in cach
    const offer = await offerModel.findById(id).populate('broker', 'name phoneNumber');
    if (!offer) return next(new Error("Offer Not Found", 404));
    
    // Cahing new data
    await redisClient.set(cacheKey, JSON.stringify(offer), 'EX', 600);

    res.status(200).json({ status: "success", data: offer });
});
//Update specific Offer  ==> (Only admins can use this)
export const updateOffer = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    //Chack if offer Exists
    const offer = await offerModel.findById(id);
    if (!offer) return next(new Error("Offer not found", 404));

    if (offer.broker.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return next(new Error("Admins are only can update offers", 403));
    }

    const updatedOffer = await offerModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    
    const keys = await redisClient.keys('offers:*');
    if (keys.length > 0) await redisClient.del(keys);
    await redisClient.del(`offer_detail:${id}`);

    res.status(200).json({ msg: "Offer updated successfully", data: updatedOffer });
});
//Delete Offer  ==> (Only admins can use this)
export const deleteOffer = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const offer = await offerModel.findById(id);
    if (!offer) return next(new Error("Offer not Exists", 404));

    
    if (offer.broker.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return next(new Error("Admins are only can update offers", 403));
    }

    await offerModel.findByIdAndDelete(id);


    const keys = await redisClient.keys('offers:*');
    if (keys.length > 0) await redisClient.del(keys);
    await redisClient.del(`offer_detail:${id}`);

    res.status(200).json({ msg: "Offer Deleted successfully" });
});