import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  authenticateUser,
  googleLogin,
} from "../controllers/authentication.controller.js";

import { checkForUserAuthentication } from "../middleware/auth.middleware.js";
import { User } from "../models/User.js";

const router = Router();
router.route("/auth/google").post(googleLogin);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/authenticate").get(authenticateUser);
router.route("/logout").post(checkForUserAuthentication, logoutUser);

export default router;