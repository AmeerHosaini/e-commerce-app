// common js syntax - front end is es module
const express = require("express");
const app = express();

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

app.listen(5000, console.log("Server is listening on port 5000"));
