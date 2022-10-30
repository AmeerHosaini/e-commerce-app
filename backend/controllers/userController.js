const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, UnAuthenticated } = require("../errors/index");
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
  res.status(StatusCodes.OK).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: null,
  });
});

module.exports = authUser;
