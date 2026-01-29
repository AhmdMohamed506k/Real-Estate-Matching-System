import mongoose, { Schema, model } from "mongoose";



const userSchema = new Schema({
    name: { 
        type: String,
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Manager', 'Broker'], 
        default: 'Broker' 
    },
    phoneNumber: { 
        type: String 
    },
    isActive: { 
        type: Boolean,
        default: true 
    },
    status:{
        type:String,
        default:"offline"
    },
    ForgetPassCode:{
        type:String,
        default:""
    }


}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


userSchema.virtual('myOffers', {
    ref: 'Offer',
    foreignField: 'broker',
    localField: '_id'
});

userSchema.virtual('myRequests', {
    ref: 'Request',
    foreignField: 'broker',
    localField: '_id'
});




userSchema.index({ role: 1, isActive: 1 });



export const Usermodel = model('User', userSchema);