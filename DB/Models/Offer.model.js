import { Schema, model } from 'mongoose';

const offerSchema = new Schema({
    propertyType: { 
        type: String, 
        enum: ['أرض', 'مخطط', 'مشروع'], 
        required: true, index: true 
    },
    category: { 
        type: String, 
        enum: ['سكني', 'تجاري', 'صناعي', 'استثماري'], 
        required: true, 
        index: true 
    },
    status: { 
        type: String, 
        enum: ['خام', 'مطورة'], 
        required: true 
    },
    city: { 
        type: String,
        required: true, 
        index: true 
    },
    district: { 
        type: String, 
        index: true 
    },
    area: { 
        type: Number, 
        required: true 
    },
    totalPrice: { 
        type: Number, 
        required: true, 
        index: true 
    },
    broker: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true 
    },
    isExclusive: { 
        type: Boolean, 
        default: false 
    }

    
}, { 
    timestamps: true 
});


offerSchema.index({ city: 1, propertyType: 1, category: 1, totalPrice: 1 });

export const offerModel = model('Offer', offerSchema);