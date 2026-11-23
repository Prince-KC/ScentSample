import { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["eSewa", "Khalti", "Cash on Delivery"],
      default: "Cash on Delivery",
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        brand: { type: String, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Dispatched", "Delivered"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);
export default Order;
