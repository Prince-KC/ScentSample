import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Perfume name is required."],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand/Fragrance house is required."],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: ["Middle Eastern", "Designer", "Niche"],
    },
    scentFamily: {
      type: String,
      default: "Woody Spicy",
    },
    description: {
      type: String,
      default: "",
    },
    notes: {
      top: [{ type: String }],
      middle: [{ type: String }],
      base: [{ type: String }],
    },
    samplePrices: {
      twoMl: { type: Number, default: 450 },
      fiveMl: { type: Number, default: 950 },
      tenMl: { type: Number, default: 1750 },
    },
    price: {
      type: Number,
      required: [true, "Base price is required."],
    },
    quantity: {
      type: Number,
      default: 50,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 14,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      default: "Bestseller",
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);
export default Product;
