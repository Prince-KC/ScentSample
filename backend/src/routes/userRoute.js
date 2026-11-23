import { Router } from "express";
import User from "../schema/userSchema.js";
import { comparePassword, hashPassword } from "../utils/hashing.js";
import { generateToken } from "../utils/token.js";

const userRoute = Router();

userRoute
  .route("/")
  .post(async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered.",
        });
      }
      const hashedPassword = await hashPassword(password);
      let result = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "customer",
      });
      res.status(200).json({
        success: true,
        message: "User created successfully",
        result: { _id: result._id, name: result.name, email: result.email, role: result.role },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
  .get(async (req, res) => {
    try {
      let result = await User.find({}, "-password");
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

// Authentication routes
userRoute.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: email.includes("admin") ? "admin" : "customer",
    });
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

userRoute
  .route("/:id")
  .get(async (req, res) => {
    try {
      let result = await User.findById(req.params.id, "-password");
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
  .patch(async (req, res) => {
    try {
      const updates = { ...req.body };
      if (updates.password) {
        updates.password = await hashPassword(updates.password);
      }
      let result = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
      res.status(200).json({
        success: true,
        message: "User data updated successfully",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
  .delete(async (req, res) => {
    try {
      let result = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

export default userRoute;
