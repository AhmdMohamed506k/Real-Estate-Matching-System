// DB/models/Notification/notification.model.js
import mongoose, { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "Match",
    },
    dealStatus: {
      type: String,
      enum: ["new", "reached", "Deal in progress", "closed"],
      default: "new",
    },
    matchDetails: {
      score: Number,
      brokerOfferName: String,
      brokerRequestName: String,
      offerId: { type: Schema.Types.ObjectId, ref: "Offer" },
      requestId: { type: Schema.Types.ObjectId, ref: "Request" },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, isRead: 1 });

export const notificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
