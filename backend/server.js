// common js syntax - front end is es module
import express from "express";
import dotenv from "dotenv";
import products from "./data/products.js";

dotenv.config();
const app = express();

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

app.listen(
  port,
  console.log(
    `Server is listening in ${process.env.NODE_ENV} mode on port ${port}`
  )
);
