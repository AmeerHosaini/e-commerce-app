const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, UnAuthenticated, NotFound } = require("../errors/index");
const asyncHandler = require("express-async-handler");

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password exists
  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }

  // Check for the user in the database
  const user = await User.findOne({ email });

  /* if (user && (await user.comparePassword(password))) {
    res.status(StatusCodes.OK).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token
    })
    else {
      throw new UnAuthenticated("Invalid email or password");
      // or
      res.status(401)
      throw new Error("Invalid email or password")
    }
  }*/

  if (!user) {
    throw new UnAuthenticated("Invalid Email");
  }

  const correctPassword = await user.comparePassword(password);

  if (!correctPassword) {
    throw new UnAuthenticated("Password does not match");
  }

  // create a token
  const token = user.createJwt();

  // These are what we want to send through Api
  res.status(StatusCodes.OK).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFound("User was not found");
  }

  res.status(StatusCodes.OK).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// @desc Update user profile
// @route Patch /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // find the logged in user's by id if he wants to update his profile
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFound("User was not found");
  } else if (user) {
    // if name wants to be updated, do it, otherwise, name stays the same
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = user.createJwt();

    res.status(StatusCodes.OK).json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token,
    });
  }
});

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new BadRequest("User already exists");
  }
  // if we dont have a middlware to hash our password, we have to hash it here before creating a document
  const user = await User.create({ name, email, password });

  if (!user) {
    throw new BadRequest("Invalid user data");
  }

  const token = user.createJwt();

  res.status(StatusCodes.CREATED).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

module.exports = { authUser, getUserProfile, registerUser, updateUserProfile };
