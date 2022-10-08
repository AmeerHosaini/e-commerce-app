const ProductModel = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../errors/index");

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
  const product = await ProductModel.findOne({ _id: productID });

  if (!product) {
    // Create a custom error --- This is when the formation of id is correct but the product with that id does not exist
    throw new NotFound(`No product was found with id ${productID}`);
  }

  res.status(StatusCodes.OK).json(product);
});

module.exports = { getProducts, getProduct };
