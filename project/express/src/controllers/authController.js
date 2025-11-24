import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";




export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        success: true,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          token: token,
        },
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable. Please check MongoDB connection.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    
    // Handle MongoDB connection errors specifically
    if (error.name === "MongooseError" && error.message.includes("buffering timed out")) {
      return res.status(503).json({
        success: false,
        message: "Database connection timeout. Please check MongoDB Atlas connection settings.",
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
