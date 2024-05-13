import { User } from "../models/User.js";
import { Subscription } from "../models/Subscription.js";
import { Movie } from "../models/movies.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { Transaction } from "../models/Transaction.js";
import bcrypt from 'bcrypt';

export const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

export const getUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).send();
        }
        res.send(user);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

export const createUser = asyncHandler(async (req, res) => {
    try {
        let user = new User(req.body);
        if (!user.subscription) {
            const defaultSubscription = await Subscription.findOne({ name: "Free", timeperiod: "1 month" });
            if (defaultSubscription) {
                user.subscription = defaultSubscription._id;
            }
        }
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

export const updateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User updated successfully');
    } catch (error) {
        res.status(400).send(error);
    }
});

export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

export const getUserSubscription = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        const subscription = await Subscription.findById(user.subscription);
        if (!subscription) {
            return res.status(404).send();
        }
        res.send(subscription);
    } catch (error) {
        res.status(500).send(error);
    }
});

export const getUpgradeSubscription = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const currentSubscription = await Subscription.findById(user.subscription);
        if (!currentSubscription) {
            return res.status(404).send("Current subscription plan not found");
        }

        let upgradeSubscriptions = [];

        const currentType = currentSubscription.name;
        if (currentType === 'Free') {
            upgradeSubscriptions = await Subscription.find({
                _id: { $ne: currentSubscription._id },
                name: { $in: ['Standard', 'Premium'] }
            });
        } else if (currentType === 'Standard') {
            upgradeSubscriptions = await Subscription.find({
                _id: { $ne: currentSubscription._id },
                name: { $in: ['Premium'] }
            });
        } else if (currentType === 'Premium') {
            upgradeSubscriptions = await Subscription.find({
                _id: { $ne: currentSubscription._id },
                name: { $in: [] }
            });
        }

        res.send(upgradeSubscriptions);
    } catch (error) {
        res.status(500).send(error);
    }
});

export const upgradeSubscription = asyncHandler(async (req, res) => {
    try {
        const { name, timeperiod } = req.body;

        // Find the subscription plan based on the provided type and period
        const subscription = await Subscription.findOne({ name: name, timeperiod: timeperiod });
        if (!subscription) {
            return res.status(404).send("Subscription plan not found");
        }

        // Update the user's subscription
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        user.subscription = subscription._id;
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

export const getUserWatchedMovies = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const watchedMovies = await Movie.find({ _id: { $in: user.watchedMovies } });
        res.send(watchedMovies);
    } catch (error) {
        res.status(500).send(error);
    }
});

export const updateUserWatchedMovies = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const movieId = req.params.movieID;
        if (!movieId) {
            return res.status(404).send("Movie ID not found");
        }

        if (!user.watchedMovies.includes(movieId)) {
            user.watchedMovies.push(movieId);
            await user.save();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

export const getUserTopPicks = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        let genres = [];
        let topPicks = [];

        const watchedMovies = await Movie.find({ _id: { $in: user.watchedMovies } });
        genres = watchedMovies.map(movie => movie.genres);

        for (const genre of genres) {
            const recentMovies = await Movie.find({ genres: { $in: genre } }).sort({ "imdb.rating": -1 }).limit(3);
            topPicks.push(...recentMovies);
        }

        topPicks = topPicks.slice(0, 15);

        if (genre.length === 0 || user.watchedMovies.length === 0) {
            topPicks = await Movie.find().sort({ "imdb.rating": -1 }).limit(15);
        }

        res.send(topPicks);
    } catch (error) {
        res.status(500).send(error);
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword, reenterPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const actualCurrentPassword = user.password;
        bcrypt.compare(currentPassword, actualCurrentPassword, async (err, result) => {
            if (err || !result) {
                return res.status(400).send("Current password is incorrect");
            }

            if (newPassword !== reenterPassword) {
                return res.status(400).send("New Passwords do not match");
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            res.status(200).send("Password updated successfully");
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export const getUserTransactions = asyncHandler(async (req, res) => {
    try {
        const Transactions = await Transaction.find({ user: req.params.id });
        res.send(Transactions);
    } catch (error) {
        res.status(500).send(error);
    }
});

export const updateUserTransaction = asyncHandler(async (req, res) => {
    try {
        const { cardNumber, cvv, expiryDate, subscription, name } = req.body;
        const userId = req.params.id;
        const newTransaction = new Transaction({
            cardNumber,
            cvv,
            expiryDate,
            subscription,
            userId,
            name
        })
        await newTransaction.save();
        const users = await User.findById(userId);
        if (!users) {
            return res.status(404).send("User not found");
        }
        users.subscription = subscription;
        users.lastPayment = new Date();
        users.transactions.push(newTransaction._id);
        await users.save();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

export const getUserPhoto = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user.profilePicture);
    } catch (error) {
        res.status(500).send(error);
    }
});


export const updateUserPhoto = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const base64Image = req.body.photo;
        if (!base64Image) {
            return res.status(400).send("Base64 image data is missing");
        }
        const user = await User.findByIdAndUpdate(userId, { profilePicture: base64Image }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});


