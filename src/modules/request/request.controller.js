import { RequestModel } from "../../../DB/Models/Request.model.js";
import {AsyncHandler} from "../../Middleware/AsyncHandler/AsyncHandler.js";
import ApiFeatures from "../../../src/untils/ApiFeatures/ApiFeatures.js";
import redisClient from "../../../src/untils/redisClient/RedisClient.js";

import { matchRequestWithOffers } from "../../untils/matchingEngine/matchingEngine.js";

// Create new Request ==> (Any User Can use this)
export const createRequest = AsyncHandler(async (req, res, next) => {



    const {  propertyType, category, city, district,  minPrice, maxPrice, minArea, maxArea } = req.body;

    const newRequest = await requestModel.create({ ...req.body, broker: req.user._id  });
     
    //Clearing Data in Cash
    const keys = await redisClient.keys('requests:*');
    if (keys.length > 0) await redisClient.del(keys);

    matchRequestWithOffers(newRequest);

    res.status(201).json({ status: "success", msg: "Your application has been successfully registered", data: newRequest });
});

// Get all Requests ==> (Any User Can use this)
export const getAllRequests = AsyncHandler(async (req, res, next) => {



    const cacheKey = `requests:${JSON.stringify(req.query)}`;

    // Check if Data is cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.status(200).json({ status: "success", source: "cache", data: JSON.parse(cachedData) });


    // Apply ApiFeatures on Data
    const features = new ApiFeatures(requestModel.find(), req.query).filter().sort().limitFields().paginate();
    const requests = await features.mongooseQuery.populate('broker', 'name phoneNumber');
    if(requests.length == 0){return res.status(400).json({msg:"No Requests available"}) }

    // Caching data 
    await redisClient.set(cacheKey, JSON.stringify(requests), 'EX', 300);

    res.status(200).json({ status: "success", results: requests.length, data: requests });
});

//Update Specific Request  ==> (Only admins can use this)
export const updateRequest = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const request = await requestModel.findById(id);
     
    //Check If Request Exists
    if (!request) return next(new Error("Request Not Found", 404));

    
    if (request.broker.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return next(new Error("Admins are only can update offers", 403));
    }

    const updatedRequest = await requestModel.findByIdAndUpdate(id, req.body, { new: true });

    //Clearing Cached Data
    const keys = await redisClient.keys('requests:*');
    if (keys.length > 0) await redisClient.del(keys);

    res.status(200).json({ status: "success", data: updatedRequest });
});

// 4. Delete Request ==> (Only admins can use this)
export const deleteRequest = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const request = await requestModel.findById(id);

    if (!request) return next(new Error("Request Not Found", 404));

    if (request.broker.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return next(new Error("Admins are only can Delete offers", 403));
    }

    await requestModel.findByIdAndDelete(id);

    //Clearing Cached Data
    const keys = await redisClient.keys('requests:*');
    if (keys.length > 0) await redisClient.del(keys);

    res.status(200).json({ status: "success", msg: "تم حذف الطلب بنجاح" });
});