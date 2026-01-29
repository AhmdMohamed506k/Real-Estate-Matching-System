import { notificationModel } from "../../../DB/Models/notification.model.js";
import {AsyncHandler} from "../../Middleware/AsyncHandler/AsyncHandler.js";
import redisClient from "../../untils/redisClient/RedisClient.js";




export const getMyNotifications = AsyncHandler(async (req, res, next) => {



    const cacheKey = `notifications:${req.user._id}`;

 
    const cachedNotifications = await redisClient.get(cacheKey);
    if (cachedNotifications) {
        return res.status(200).json({ status: "success", source: "cache", data: JSON.parse(cachedNotifications) });
    }

    const notifications = await notificationModel.find({ recipient: req.user._id })
        .populate('matchDetails.offerId')
        .populate('matchDetails.requestId')
        .sort('-createdAt')
        .limit(50);

    await redisClient.set(cacheKey, JSON.stringify(notifications), 'EX', 120);

    res.status(200).json({ status: "success", data: notifications });
});

export const updateDealStatus = AsyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;
    const { newStatus } = req.body;

    const validStatuses = ['new', 'reached', 'Deal in progress', 'closed'];
    if (!validStatuses.includes(newStatus)) {
        return next(new Error("Invalid status, choose from: " + validStatuses.join(', '), 400));
    }

    const notification = await notificationModel.findOneAndUpdate(
        { _id: notificationId, recipient: req.user._id },
        { dealStatus: newStatus },
        { new: true }
    );

    if (!notification) return next(new Error("The notice does not exist or you are not authorized", 404));

    await redisClient.del(`notifications:${req.user._id}`);
    res.status(200).json({ status: "success", msg: "The transaction status has been updated successfully", data: notification });
});

export const markAsRead = AsyncHandler(async (req, res, next) => {
    await notificationModel.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    );
    
    await redisClient.del(`notifications:${req.user._id}`);
    res.status(200).json({ status: "success", msg: "All is selected as read" });
});