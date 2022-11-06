const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
} = require("../controllers/orderController");
const protect = require("../middlewares/auth_middleware");

router.route("/").post(protect, addOrderItems);
// This must always be at the bottom - if we set another route as /route, it will look at it as an id
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").patch(protect, updateOrderToPaid);

module.exports = router;
