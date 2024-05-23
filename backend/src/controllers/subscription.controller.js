import { User } from "../models/User.js";
import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";

export const changeUserSubscription = asyncHandler(async (req, res) => {
    const user_id = req.params.user_id;
    console.log(user_id);
    const user = await User.findById(user_id);

    if (!user) {
        throw new ApiError(404, "User not found");
    } else {
        const { subscriptionType } = req.body; // Extract subscriptionType from req.body
        console.log("New subscription:", subscriptionType);

        if (!subscriptionType) {
            throw new ApiError(400, "Subscription type is required");
        }

        user.subscription = subscriptionType; // Assign the subscriptionType directly
        user.save()
            .then(result => {
                res.status(201).json({
                    message: "Subscription updated"
                });
            })
            .catch(err => {
                console.error("Error saving user:", err);
                res.status(504).json({
                    error: err
                });
            });
    }
});