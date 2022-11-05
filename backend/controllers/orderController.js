const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/OrderModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/index");

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

// @desc Get order by id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId: id } = req.params;
  // In addition to the order id, we want the user's name and email address that is associated with the id
  // populate will attach the fields we specify to the id
  const order = await OrderModel.findById(id).populate("user", "name email");
  if (!order) {
    throw new NotFound("Order not found");
  }

  console.log(order);

  res.status(StatusCodes.OK).json(order);
});

module.exports = { addOrderItems, getOrderById };
