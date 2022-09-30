import ProductModel from "../models/ProductModel.js";

const getProducts = async (req, res) => {
  const products = await ProductModel.find();
  res.status(200).json(products);
};

const getProduct = async () => {};

export { getProducts, getProduct };
