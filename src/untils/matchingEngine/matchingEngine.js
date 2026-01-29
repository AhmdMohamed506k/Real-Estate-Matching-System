// utils/matchingEngine.js
import { offerModel } from "../../../DB/Models/Offer.model.js";
import { RequestModel } from "../../../DB/Models/Request.model.js";
import { notificationModel } from "../../../DB/Models/notification.model.js";

// When a broker adds a new "offer" -> we search for the appropriate "orders" for it
export const matchOfferWithRequests = async (newOffer, brokerName) => {
    const potentialMatches = await requestModel.find({
        city: newOffer.city,
        propertyType: newOffer.propertyType
    }).populate('broker', 'name');

    const notifications = [];

    for (const request of potentialMatches) {
        let score = calculateScore(newOffer, request); 

        if (score >= 75) {
          
            notifications.push({
                recipient: request.broker._id,
                message: `We found you a property that matches your request by a ${score}%`,
                matchDetails: {
                    score,
                    brokerOfferName: brokerName,
                    brokerRequestName: request.broker.name,
                    offerId: newOffer._id,
                    requestId: request._id
                }
            });

            notifications.push({
                recipient: newOffer.broker,
                message: `There is a demand that matches your offered property by a ${score}%`,
                matchDetails: {
                    score,
                    brokerOfferName: brokerName,
                    brokerRequestName: request.broker.name,
                    offerId: newOffer._id,
                    requestId: request._id
                }
            });
        }
    }
    if (notifications.length > 0) await notificationModel.insertMany(notifications);
};



// When a broker adds a new "order" -> we search for the appropriate "offers" for it
export const matchRequestWithOffers = async (newRequest, requestBrokerName) => {
    try {
      
        const potentialOffers = await offerModel.find({
            city: newRequest.city,
            propertyType: newRequest.propertyType,
            category: newRequest.category
        }).populate('broker', 'name');

        if (potentialOffers.length === 0) return;

        const notifications = [];

        for (const offer of potentialOffers) {
            let score = 50; 

         
            if (offer.totalPrice >= newRequest.minPrice && offer.totalPrice <= newRequest.maxPrice) score += 25;
            if (offer.area >= newRequest.minArea && offer.area <= newRequest.maxArea) score += 25;

         
            if (score >= 75) {
              
                const commonMatchDetails = {
                    score,
                    brokerOfferName: offer.broker.name, 
                    brokerRequestName: requestBrokerName, 
                    offerId: offer._id,
                    requestId: newRequest._id
                };

     
                notifications.push({
                    recipient: newRequest.broker,
                    message: `We found an offer that matches your new order by a ${score}%!`,
                    dealStatus: 'new',
                    matchDetails: commonMatchDetails
                });

             
                notifications.push({
                    recipient: offer.broker._id,
                    message: `There is a new order that matches your offered property by a ${score}%!`,
                    dealStatus: 'new',
                    matchDetails: commonMatchDetails
                });
            }
        }

        
        if (notifications.length > 0) {
            await notificationModel.insertMany(notifications);
        }

    } catch (error) {
        console.error("Advanced Matching Engine Error (Request Match):", error);
    }
};