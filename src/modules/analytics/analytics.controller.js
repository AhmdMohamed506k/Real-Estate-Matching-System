import { offerModel } from "../../../DB/Models/Offer.model.js";
import { RequestModel } from "../../../DB/Models/Request.model.js";
import { notificationModel } from "../../../DB/Models/notification.model.js";
import { Usermodel } from "../../../DB/Models/User.model.js";
import {AsyncHandler} from "../../Middleware/AsyncHandler/AsyncHandler.js";
import redisClient from "../../../src/untils/redisClient/RedisClient.js";




export const getAdminStats = AsyncHandler(async (req, res, next) => {



    const cacheKey = "admin_dashboard_stats";
    
    
    const cachedStats = await redisClient.get(cacheKey);
    if (cachedStats) return res.status(200).json({ status: "success", source: "cache", data: JSON.parse(cachedStats) });

    
    const [totalUsers, totalOffers, totalRequests, cityStats, dealStats] = await Promise.all([
        Usermodel.countDocuments(),
        offerModel.countDocuments(),
        RequestModel.countDocuments(),
        
    
        offerModel.aggregate([
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]),

    
        notificationModel.aggregate([
            { $group: { _id: "$dealStatus", count: { $sum: 1 } } }
        ])
    ]);

    const stats = {
        overview: { totalUsers, totalOffers, totalRequests },
        topCities: cityStats,
        dealsBreakdown: dealStats
    };

    await redisClient.set(cacheKey, JSON.stringify(stats), 'EX', 3600);

    res.status(200).json({ status: "success", data: stats });
});


export const getMyStats = AsyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const [myOffers, myRequests, myClosedDeals] = await Promise.all([
        offerModel.countDocuments({ broker: userId }),
        RequestModel.countDocuments({ broker: userId }),
        notificationModel.countDocuments({ recipient: userId, dealStatus: 'مغلقة' })
    ]);

    res.status(200).json({
        status: "success",
        data: {
            activeOffers: myOffers,
            activeRequests: myRequests,
            closedDeals: myClosedDeals
        }
    });
});