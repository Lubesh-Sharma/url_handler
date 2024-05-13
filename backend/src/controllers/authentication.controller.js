import { Subscription } from "../models/Subscription.js";
import { User } from "../models/User.js";
import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import passport from "passport";
import { OAuth2Client } from 'google-auth-library';

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // if (!username || username.trim() === "") throw new ApiError(400, "Name is required");
  if (!email || email.trim() === "")
    throw new ApiError(501, "Email is required");
  if (!password || password.trim() === "")
    throw new ApiError(502, "Password is required");
  // if (!mobileNumber || mobileNumber.trim() === "")
  //   throw new ApiError(400, "Mobile Number is required");
  try {
    const existedUser = await User.findOne({
      email: email,
    });
    if (existedUser) {
      throw new ApiError(409, "User with email already exists");
    }
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(503).json({
          error: err
        });
      }
      const user = new User({
        // username: username,
        email: email,
        password: hash,
        // mobileNumber: mobileNumber,
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "user created"
          });
        })
        .catch(err => {
          console.error("Error saving user:", err);
          res.status(504).json({
            error: err
          });
        });
    });
  } catch (error) {
    console.error("Error finding user:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email is required");
  }
  if (!password || password.trim() === "") {
    throw new ApiError(400, "Password is required");
  }

  if (role == true) {
    const user = await User.findOne({
      email,
    }).populate('subscription')
    if (!user) {
      res.status(201).json({
        message: "Admin not found"
      });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(201).json({
          message: "Invalid Credential"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id
          },
          process.env.JWT_KEY,
        );
        res.cookie('jwtToken', token, { httpOnly: true, secure: true, maxAge: 3600000 * 24 * 7 });
        return res.status(200).json({
          message: 'Admin login successful',
          token: token,
          user,
        });
      }
      return res.status(401).json({
        message: 'Admin Access denied'
      });
    });
  }

  const user = await User.findOne({
    email: email,
  }).populate('subscription');

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      throw new ApiError(401, "Invalid credentials");

    }
    if (result) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id
        },
        process.env.JWT_KEY,
      );
      res.cookie('jwtToken', token, { httpOnly: true, secure: true, maxAge: 3600000 * 24 * 7 });
      return res.status(200).send({
        message: 'Auth successful',
        token: token,
        user,
      });
    }
    return res.status(401).json({
      message: 'Auth failed'
    });
  });
});

export const authenticateUser = asyncHandler(async (req, res) => {
  try {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decodedToken.userId).populate('subscription')
    res.status(200).json({
      "user": user,
    });
  }
  catch {
    res.status(401).send({
      message: "Some Error Occurred"
    });
  }
})


export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwtToken');
  res.redirect(200, 'http://localhost:4000/');
});

export const googleLogin = asyncHandler(async (req, res) => {
  try {
    const googleToken = req.body.token;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    if (!ticket) {
      return res.status(401).json({
        message: 'Google login failed'
      });
    }
    if (ticket.getPayload().email_verified === false) {
      return res.status(404).json({
        message: 'Email not verified'
      });
    }
    const { email } = ticket.getPayload();
    console.log(email);
    const query = { email };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id
      },
      process.env.JWT_KEY,
    );
    res.cookie('jwtToken', token, { httpOnly: true, secure: true, maxAge: 3600000 * 24 * 7 });
    return res.status(200).send({
      message: 'Google Auth successful',
      token: token,
      user,
    });
  }
  catch (error) {
    console.error('some error has occurred')
  };
});
