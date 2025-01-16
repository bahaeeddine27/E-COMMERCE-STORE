import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(5000, () =>{
    console.log("Server is running on http://localhost:" + PORT);

    connectDB();
});