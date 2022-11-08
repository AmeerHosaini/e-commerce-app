const express = require("express");
const {
  getProducts,
  getProductById,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middlewares/auth_middleware");
const router = express.Router();

router.route("/").get(getProducts);

router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct);

module.exports = router;

/*

 (req, res) => {
  const { id: productId } = req.params;
  // Later with the help of mongoose, we would use findOneById
  const product = products.find((product) => product._id === productId);
  res.json(product);
}
*/
