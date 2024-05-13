import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        default: null,
    },
    cvv: {
        type: String,
        default: null,
    },
    expiryDate: {
        type: String,
        default: null,
    },
    name: {
        string: String,
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
})

export const Transaction = mongoose.model('Transaction', transactionSchema);