const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/OrderModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors/index");

// @desc Create new order
// @route POST /api/orders
// @access private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // We want to make sure orderItems comes in and it is not empty
  if (orderItems && orderItems.length === 0) {
    throw new BadRequest("No order items");
  } else {
    const order = new OrderModel({
      orderItems,
      // logged in user - because this is a protected route, we will be able to get a token and access the user id from the token
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(StatusCodes.CREATED).json(createdOrder);
  }
});

module.exports = { addOrderItems };
