import mongoose, { Schema, model } from "mongoose";



const requestSchema = new Schema({
    propertyType: { 
        type: String, 
        enum: ['أرض', 'مخطط', 'مشروع'],
        required: true 
    },
    category: { 
        type: Array, 
        required: true 
    }, 
    landStatus: { 
        type: String, 
        enum: ['خام', 'مطورة', 'الكل'] 
    },
    city: { 
        type: String, 
        required: true 
    },
    district: { 
        type: String 
    },
    minArea: { 
        type: Number
    },
    maxArea: { 
        type: Number 
    },
    budget: { 
        type: Number, 
        required: true 
    },
    priority: { 
        type: String, 
        enum: ['عالي', 'متوسط', 'منخفض'], 
        default: 'متوسط' 
    },
    broker: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    }
}, { 
    timestamps: true 
});

requestSchema.index({ city: 1, budget: -1, priority: 1 });


export const RequestModel = mongoose.models.Request || mongoose.model('Request', requestSchema);