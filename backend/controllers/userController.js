const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequest,
  UnAuthenticated,
  NotFound,
  ServerError,
} = require("../errors/index");
const asyncHandler = require("express-async-handler");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");

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

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json(users);
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndRemove({ _id: userId });
  if (!user) {
    throw new NotFound(`The user with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ message: "User removed" });

  /* 
  const user = await User.findOne(req.params.id)
  if (user) {
    await user.remove()
    res.json({message: 'User removed})
  }
  */
});

// @desc Get user by Id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new NotFound(`The user with the id ${req.params.id} does not exist`);
  }

  res.status(StatusCodes.OK).json(user);
});

// @desc Update User
// @route PATCH /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFound(`The user with the id ${req.params.id} does not exist`);
  } else if (user) {
    // if there is a name, set it to user
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();
    res.status(StatusCodes.OK).json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  }
});

// @desc forgot Password
// @route POST /api/users/forgotpassword
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound("Email could not be found");
  }
  // generate Token
  const resetToken = user.getResetPasswordToken();
  // save the newly created field to the DB
  await user.save();

  const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  `;

  try {
    await sendMail({
      to: user.email,
      subject: "Password reset request",
      text: message,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: "Email sent",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new ServerError("Email could not be sent");
  }
});

// @desc Reset Password
// @route PUT /api/users/resetPassword/:resetToken
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  // search for the user that has the same token
  const user = await User.findOne({
    resetPasswordToken,
    // ensures that the token is still valid
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequest("Invalid Reset Token");
  }

  // send the new password
  user.password = req.body.password;

  // we dont want the user to reuse the token
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // resave the password and hash it
  await user.save();
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: "Password Reset Success",
  });
});

module.exports = {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
};
