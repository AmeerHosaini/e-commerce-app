const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getLoggedInUserOrders,
  getOrders,
  updateOrderToDelivered,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/auth_middleware");

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myOrders").get(protect, getLoggedInUserOrders);
// This must always be at the bottom - if we set another route as /route, it will look at it as an id
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").patch(protect, updateOrderToPaid);
router.route("/:id/pay").patch(protect, admin, updateOrderToDelivered);

module.exports = router;
