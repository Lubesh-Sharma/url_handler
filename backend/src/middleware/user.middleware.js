import { User } from "../models/User.js";
import { Subscription } from "../models/Subscription.js";
import { ApiError } from "../utilities/ApiError.js";

export const userSubscriptionData = async (req,res,next) => {
    try{
        const userId = req.userData.userId;
        const userData = await User.findById(userId);

        if(!userData){
            throw new ApiError(404, "User not found");
        }

        const subscriptionId = userData.subscription;
        const subscriptionData = await Subscription.findById(subscriptionId);

        if(!subscriptionData){
            throw new ApiError(404, "Subscription not found");
        }

        req.userSubscription = {
            user: userData,
            subscription: subscriptionData
        };
        next();
    }catch(error){
        throw new ApiError(500, error.message);
    }
};