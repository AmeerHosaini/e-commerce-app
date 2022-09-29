// common js syntax - front end is es module
import express from "express";
import dotenv from "dotenv";
import products from "./data/products.js";
import connectDB from "./config/db.js";
import colors from "colors";

dotenv.config();
const app = express();

// connectDB() with the previous setup

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const { id: productId } = req.params;
  // Later with the help of mongoose, we would use findOneById
  const product = products.find((product) => product._id === productId);
  res.json(product);
});

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
