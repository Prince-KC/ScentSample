import { Router } from "express";
import Order from "../schema/orderSchema.js";

const orderRoute = Router();

orderRoute
  .route("/")
  .post(async (req, res) => {
    try {
      const result = await Order.create(req.body);
      res.status(200).json({
        success: true,
        message: "Order placed successfully! ScentSampleNepal will contact you for dispatch confirmation.",
        result: result,
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
      const result = await Order.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

export default orderRoute;
