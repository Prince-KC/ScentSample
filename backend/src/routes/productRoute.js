import { Router } from "express";
import Product from "../schema/productSchema.js";

const productRoute = Router();

productRoute
  .route("/")
  .post(async (req, res) => {
    try {
      // Auto-populate sample prices if not fully provided
      const body = { ...req.body };
      if (!body.samplePrices && body.price) {
        body.samplePrices = {
          twoMl: Math.round(body.price * 0.45),
          fiveMl: Math.round(body.price),
          tenMl: Math.round(body.price * 1.85),
        };
      }
      let result = await Product.create(body);
      res.status(200).json({
        success: true,
        message: "Perfume decant created successfully.",
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
      const { category, search, sort } = req.query;
      let query = {};

      if (category && category !== "All") {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { scentFamily: { $regex: search, $options: "i" } },
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === "price-asc") sortOptions = { price: 1 };
      if (sort === "price-desc") sortOptions = { price: -1 };
      if (sort === "rating") sortOptions = { rating: -1 };

      let result = await Product.find(query).sort(sortOptions);

      res.status(200).json({
        success: true,
        message: "Products fetched successfully.",
        count: result.length,
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

productRoute
  .route("/:id")
  .get(async (req, res) => {
    try {
      let result = await Product.findById(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Perfume not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Perfume read successfully",
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
      let result = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "Perfume updated successfully",
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
      let result = await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Perfume deleted successfully",
        result: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

export default productRoute;
