const express = require("express");
const { getProducts, getProduct } = require("../controllers/productController");
const router = express.Router();

router.route("/").get(getProducts);

router.route("/:id").get(getProduct);

module.exports = router;

/*

 (req, res) => {
  const { id: productId } = req.params;
  // Later with the help of mongoose, we would use findOneById
  const product = products.find((product) => product._id === productId);
  res.json(product);
}
*/
