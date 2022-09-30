// common js syntax - front end is es module
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import productRoutes from "./routes/productRoute.js";

dotenv.config();
const app = express();

// connectDB() with the previous setup
app.use("/api/products", productRoutes);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(
      port,
      console.log(
        `Server is listening in ${process.env.NODE_ENV} mode on port ${port}`
          .yellow.bold.underline
      )
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
  }
};

start();
