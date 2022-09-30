import express from "express";
import { getProducts, getProduct } from "../controllers/productController.js";
const router = express.Router();

router.route("/").get(getProducts);

router.route("/:id").get(getProduct);

export default router;

/*

 (req, res) => {
  const { id: productId } = req.params;
  // Later with the help of mongoose, we would use findOneById
  const product = products.find((product) => product._id === productId);
  res.json(product);
}
*/
