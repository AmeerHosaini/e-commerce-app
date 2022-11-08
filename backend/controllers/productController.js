const ProductModel = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { NotFound } = require("../errors/index");

// @desc Fetch All Products
// @route /api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const products = await ProductModel.find({});
  res.status(StatusCodes.OK).json(products);
});

// @desc Fetch a single product
// @route GET /api/products/:id
// @access public
const getProductById = asyncHandler(async (req, res) => {
  const { id: productID } = req.params;
  const product = await ProductModel.findOne({ _id: productID });

  if (!product) {
    // Create a custom error --- This is when the formation of id is correct but the product with that id does not exist
    throw new NotFound(`No product was found with id ${productID}`);
  }

  res.status(StatusCodes.OK).json(product);
});

// @desc delete a product
// @route DELETE /api/products/:id
// @access private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  /*
    if (req.user._id === product.user._id) ---> Only admins that created the product can delete the product
  */

  const { id: productId } = req.params;
  const product = await ProductModel.findById(productId);
  if (product) {
    await product.remove();
    res.status(StatusCodes.OK).json({ message: "Product removed" });
  } else {
    throw new NotFound(`No product was found with id ${productId}`);
  }
});

module.exports = { getProducts, getProductById, deleteProduct };
