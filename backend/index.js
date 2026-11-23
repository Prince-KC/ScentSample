import express, { json } from "express";
import cors from "cors";
import connectToDb from "./src/connectToDb.js";
import productRoute from "./src/routes/productRoute.js";
import userRoute from "./src/routes/userRoute.js";
import reviewRoute from "./src/routes/reviewRoute.js";
import orderRoute from "./src/routes/orderRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ScentSampleNepal API - Nepal's Premier Luxury Perfume Decant Store",
    endpoints: {
      products: "/product",
      users: "/user",
      reviews: "/review",
      orders: "/order",
    },
    categories: ["Middle Eastern", "Designer", "Niche"],
    status: "online",
  });
});

app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/review", reviewRoute);
app.use("/order", orderRoute);

// Start server
app.listen(PORT, async () => {
  console.log(`ScentSampleNepal backend listening on http://localhost:${PORT}`);
  await connectToDb();
});
