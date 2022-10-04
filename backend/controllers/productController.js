const ProductModel = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

// @desc Fetch All Products
// @route /api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find();
  res.status(StatusCodes.OK).json(products);
});

// @desc Fetch a single product
// @route /api/products/:id
// @access public
const getProduct = asyncHandler(async (req, res) => {
  const { id: productID } = req.params;
  const product = await ProductModel.findById(productID);

  if (!product) {
    // Create a custom error
  }

  res.status(StatusCodes.OK).json({ product });
});

module.exports = { getProducts, getProduct };
