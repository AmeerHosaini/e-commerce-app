// common js syntax - front end is es module
const express = require("express");
const app = express();
require("dotenv").config();

const products = require("./data/products");

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
