import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const checkForAdminAuthentication = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decodedToken.userId);
    if (user.role === true) {
      req.userData = decodedToken;
      next();
    }
    else {
      return res.status(403).send("You are not authorized to access this resource");
    }
  }
  catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const checkForUserAuthentication = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization || req.query.authorization;
    const token = bearerHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decodedToken;
    next();
  }
  catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

