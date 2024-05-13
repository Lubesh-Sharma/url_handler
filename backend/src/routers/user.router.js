import { Router } from "express";
import {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserSubscription,
    getUpgradeSubscription,
    upgradeSubscription,
    getUserWatchedMovies,
    updateUserWatchedMovies,
    getUserTopPicks,
    resetPassword,
    getUserTransactions,
    updateUserTransaction,
    getUserPhoto,
    updateUserPhoto
  } from "../controllers/user.controller.js"
import { checkForAdminAuthentication } from "../middleware/auth.middleware.js";
import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
import { userSubscriptionData } from "../middleware/user.middleware.js";

const router = Router();

//user details
router.route("/").post(checkForAdminAuthentication,createUser) ;
router.route("/").get(getAllUsers) ;
router.route("/:id").get(getUser) ;
router.route("/:id").patch(updateUser) ;
router.route("/:id").delete(checkForAdminAuthentication,deleteUser) ;

//user subscription
router.route("/:id/subscription").get(getUserSubscription);
router.route("/:id/subscription/upgrade").get(getUpgradeSubscription);
router.route("/:id/subscription/upgrade").patch(checkForAdminAuthentication,upgradeSubscription);

//user movie details
router.route("/:id/movies/watched").get(checkForUserAuthentication,getUserWatchedMovies);
router.route("/:id/movies/watched/:movieID").patch(checkForAdminAuthentication,updateUserWatchedMovies);
router.route("/:id/movies/topPicks").get(checkForUserAuthentication,getUserTopPicks);

//user reset password
router.route("/:id/resetPassword").patch(resetPassword);

//user transactions
router.route("/:id/transactions").get(getUserTransactions);
router.route("/:id/transactions").post(updateUserTransaction);

//user photo
router.route("/:id/photo").get(getUserPhoto);
router.route("/:id/photo").patch(updateUserPhoto);

export default router ;
