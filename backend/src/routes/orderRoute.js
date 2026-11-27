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

// Update order status (admin)
orderRoute.patch("/:id", async (req, res) => {
  try {
    const result = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    if (!result) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order status updated", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete order (admin)
orderRoute.delete("/:id", async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, message: "Order deleted", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get orders by customer email
orderRoute.get("/customer/:email", async (req, res) => {
  try {
    const result = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: "Customer orders fetched", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default orderRoute;
