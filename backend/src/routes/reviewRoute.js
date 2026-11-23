import { Router } from "express";
import Review from "../schema/reviewSchema.js";
import Product from "../schema/productSchema.js";

const reviewRoute = Router();

reviewRoute
  .route("/")
  .post(async (req, res) => {
    try {
      const { productId, userName, rating, comment, scentLongevity } = req.body;
      const review = await Review.create({
        productId,
        userName,
        rating: Number(rating),
        comment,
        scentLongevity: scentLongevity || "8+ Hours",
      });

      // Update product rating and reviews count
      const reviews = await Review.find({ productId });
      const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
      await Product.findByIdAndUpdate(productId, {
        rating: Number(avgRating),
        reviewsCount: reviews.length,
      });

      res.status(200).json({
        success: true,
        message: "Review submitted successfully",
        result: review,
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
      let result = await Review.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        message: "Reviews fetched successfully",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

reviewRoute.get("/product/:productId", async (req, res) => {
  try {
    let result = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Product reviews fetched successfully",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default reviewRoute;
