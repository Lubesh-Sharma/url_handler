import { Router } from "express";
import {
  get_All_SubscriptionPlan,
  get_SubscriptionPlan_ById,
  Create_SubscriptionPlan,
  Update_SubscriptionPlan,
  Delete_SubscriptionPlan,
} from "../controllers/subscription.controller.js"
import { checkForAdminAuthentication } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(get_All_SubscriptionPlan);
router.route("/:id").get(get_SubscriptionPlan_ById);
router.route("/").post(checkForAdminAuthentication,Create_SubscriptionPlan);
router.route("/:id").patch(checkForAdminAuthentication,Update_SubscriptionPlan);
router.route("/:id").delete(checkForAdminAuthentication,Delete_SubscriptionPlan);

export default router;