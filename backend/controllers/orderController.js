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
    throw new BadRequest("no-order-items", req);
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
  // const { id: orderId } = req.params;
  // In addition to the order id, we want the user's name and email address that is associated with the id
  // populate will attach the fields we specify to the id
  const order = await OrderModel.findOne({ _id: req.params.id }).populate(
    "user",
    "name email"
  );
  if (!order) {
    throw new NotFound("no-order", req, { id: req.params.id });
  }
  res.status(StatusCodes.OK).json(order);
});

// @desc Update order to pay
// @route patch /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await OrderModel.findOne({ _id: req.params.id });
  if (!order) {
    throw new NotFound("no-order", req, { id: req.params.id });
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  // This will come from paypal
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  // We should save the fields to the database since we are updating them
  const updatedOrder = await order.save();
  res.status(StatusCodes.OK).json(updatedOrder);
});

// @desc Update order to delivered
// @route patch /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await OrderModel.findOne({ _id: req.params.id });
  if (!order) {
    throw new NotFound("no-order", req, { id: req.params.id });
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(StatusCodes.OK).json(updatedOrder);
});

// @desc Get logged in user orders
// @route GET /api/orders/myOrders
// @access Private
const getLoggedInUserOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id });
  res.status(StatusCodes.OK).json(orders);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // From the user that is associated to order, get id and name
  const orders = await OrderModel.find({}).populate("user", "id name");
  res.status(StatusCodes.OK).json(orders);
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getLoggedInUserOrders,
  getOrders,
};
