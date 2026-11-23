import { model, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required."],
    },
    userName: {
      type: String,
      required: [true, "Reviewer name is required."],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required."],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required."],
    },
    scentLongevity: {
      type: String,
      default: "8+ Hours",
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);
export default Review;
