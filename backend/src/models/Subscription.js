import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Free', 'Standard', 'Premium'],
        default: 'Free',
    },
    resolution: {
        type: Number,
        enum: [360, 720, 1080],
        default: 360,
    },
    timeperiod: {
        type: String,
        enum: ["1 month", "6 months", "12 months"],
        default: "1 month",
    },
    price: {
        type: Number,
        default: 0,
    },
    download: {
        type: Boolean,
        default: false,
    },
    forward_backward: {
        type: Boolean,
        default: false,
    },
    skip_ads: {
        type: Boolean,
        default: false,
    },
    devices: {
        type: Number,
        default: 1,
    },
});

subscriptionSchema.index({ name: 1, timeperiod: 1 }, { unique: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);