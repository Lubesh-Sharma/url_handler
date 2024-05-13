import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        default: "Unkonwn",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        default: "lub@gmail.com"
    },
    password: {
        type: String,
        required: true,
        default: "123456",
    },
    // mobileNumber: {
    //     type: String,
    //     default: null,
    // },
    // profilePicture: {
    //     type: String,
    //     default: null,
    // },
    // role: {
    //     type: Boolean,
    //     default: false
    // },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null
    },
    lastPayment: {
        type: Date,
        default: null
    },
    Links: {
        newLink: {
            type: [String],
            default: null
        },
        oldLink: {
            type: [String],
            default: null
        }
    },
    // devicesLogged: {
    //     type: Number,
    //     default: 0,
    // },
    transactions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Transaction',
        default: []
    },
    refreshToken: {
        type: String,
        default: null,
    },
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return password === this.password;
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_KEY, { expiresIn: '1h' });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_KEY, { expiresIn: '7d' });
};

export const User = mongoose.model('User', userSchema);

