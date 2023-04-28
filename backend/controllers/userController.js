const User = require("../models/UserModel");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequest,
  UnAuthenticated,
  NotFound,
  ServerError,
} = require("../errors/index");
const asyncHandler = require("express-async-handler");
const { sendEmailRegister, sendMail } = require("../utils/sendEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const validateEmail = require("../utils/validateEmail");
const createToken = require("../utils/createToken");
const UserModel = require("../models/UserModel");
// const { OAuth2Client } = require("google-auth-library");

// @desc Register a new user - allows the user to access the website's functionality
// @route POST /api/users
// @access Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name) {
//     throw new BadRequest("name-required", req);
//   }

//   if (!email) {
//     throw new BadRequest("email-required", req);
//   }

//   if (!password) {
//     throw new BadRequest("password-required", req);
//   }

//   if (!validateEmail(email)) {
//     throw new BadRequest("valid-email", req);
//   }

//   if (password.length < 6) {
//     throw new BadRequest("password-small", req);
//   }

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     throw new BadRequest("user-exists", req);
//   }
//   // if we dont have a middlware to hash our password, we have to hash it here before creating a document
//   const user = await User.create({ name, email, password });

//   if (!user) {
//     throw new BadRequest("invalid-data", req);
//   }

//   const token = user.createJwt();

//   res.status(StatusCodes.CREATED).json({
//     _id: user.id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//     token,
//   });
// });

// @desc Register a new user - Only sends the message to the user to check his email
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) {
    throw new BadRequest("name-required", req);
  }

  if (!email) {
    throw new BadRequest("email-required", req);
  }

  if (!password) {
    throw new BadRequest("password-required", req);
  }

  if (!validateEmail(email)) {
    throw new BadRequest("valid-email", req);
  }

  if (password.length < 6) {
    throw new BadRequest("password-small", req);
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new BadRequest("user-exists", req);
  }

  // create a token
  const newUser = { name, email, password };
  const activation_token = createToken.activation(newUser);

  // send email
  const url = `http://localhost:3000/activate/${activation_token}`;
  sendEmailRegister(email, url, "Verify Your Email");

  // registeration success
  res.status(200).json({ msg: req.t("check-email") });
});

// @desc Register a new user
// @route POST /api/users/activate
// @access Public
const activate = asyncHandler(async (req, res) => {
  // get the token
  const { activation_token } = req.body;

  // verify the token
  const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN);
  const { name, email, password } = user;

  // check the user
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    throw new BadRequest("user-exists", req);
  }

  // Add User
  const newUser = new UserModel({
    name,
    email,
    password,
  });

  await newUser.save();

  // activation success
  res.status(200).json({ msg: req.t("account-activated") });
});

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password exists
  if (!email || !password) {
    throw new BadRequest("provide-email-password", req);
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
    throw new UnAuthenticated("no-user", req);
  }

  const correctPassword = await user.comparePassword(password);

  if (!correctPassword) {
    throw new UnAuthenticated("password-does-not-match", req);
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

// @desc sign in user with gmail using GoogleLogin component from @react-oauth/google
// @route POST /api/users/google-login
// @access Public
// const googleLogin = asyncHandler(async (req, res) => {
//   // get tokenId coming from the frontend
//   const { access_token } = req.body;

//   // Verify tokenId
//   const client = new OAuth2Client(process.env.G_CLIENT_ID);

//   const ticket = await client.verifyIdToken({
//     idToken: access_token,
//     audience: process.env.G_CLIENT_ID,
//   });

//   // get Data
//   const payload = ticket.getPayload();
//   const email_verified = payload.email_verified;
//   const email = payload.email;
//   const name = payload.name;
//   const picture = payload.picture;

//   // failed Verification
//   if (!email || !email_verified) {
//     throw new BadRequest("Email Verification Failed");
//   }

//   // passed verification
//   const user = await User.findOne({ email });

//   // if user exists in db / sign in
//   if (user) {
//     // create a refresh token
//     const refreshToken = user.createRefreshToken();
//     // create a token
//     const token = user.createJwt();

//     // store cookie
//     res.cookie("_apprftoken", refreshToken, {
//       httpOnly: true,
//       path: "/api/users/login",
//       maxAge: 24 * 60 * 60 * 1000, // 24hrs
//     });
//     // success, include user info in response
//     res.status(StatusCodes.OK).json({
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token,
//     });
//   } else {
//     // new user, create user
//     const password = email + process.env.G_CLIENT_ID;
//     const newUser = new User({
//       name,
//       email,
//       password,
//     });
//     await newUser.save();
//     // sign in the user
//     // create a refresh token
//     const refreshToken = user.createRefreshToken();

//     // create a token
//     const token = user.createJwt();

//     // store cookie
//     res.cookie("_apprftoken", refreshToken, {
//       httpOnly: true,
//       path: "/api/users/login",
//       maxAge: 24 * 60 * 60 * 1000, // 24hrs
//     });
//     // success, include user info in response
//     res.status(StatusCodes.CREATED).json({
//       name: newUser.name,
//       email: newUser.email,
//       isAdmin: newUser.isAdmin,
//       token,
//     });
//   }
// });

// @desc sign in user with gmail using custom google button from @react-oauth/google
// @route POST /api/users/google-login
// @access Public
const googleLogin = asyncHandler(async (req, res) => {
  // get tokenId coming from the frontend
  const { access_token } = req.body;

  // Make a request to Google API to get user info
  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  // const userInfo = await userInfoResponse.json();

  // get Data
  const email = data.email;
  const name = data.name;
  // const verified_email = data.verified_email;
  const picture = data.picture;

  // failed Verification
  if (!email) {
    throw new BadRequest("email-verification-failed", req);
  }

  // passed verification
  const user = await User.findOne({ email });

  // if user exists in db / sign in
  if (user) {
    // create a refresh token
    const refreshToken = user.createRefreshToken();
    // create a token
    const token = user.createJwt();

    // store cookie
    res.cookie("_apprftoken", refreshToken, {
      httpOnly: true,
      path: "/api/users/login",
      maxAge: 24 * 60 * 60 * 1000, // 24hrs
    });
    // success, include user info in response
    res.status(StatusCodes.OK).json({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    // new user, create user
    const password = email + process.env.G_CLIENT_ID;
    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save();
    // sign in the user
    // create a refresh token
    const refreshToken = newUser.createRefreshToken();

    // create a token
    const token = newUser.createJwt();

    // store cookie
    res.cookie("_apprftoken", refreshToken, {
      httpOnly: true,
      path: "/api/users/login",
      maxAge: 24 * 60 * 60 * 1000, // 24hrs
    });
    // success, include user info in response
    res.status(StatusCodes.CREATED).json({
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token,
    });
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFound("user-not-found", req, {});
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
    throw new NotFound("user-not-found", req, {});
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
  const user = await User.findOneAndRemove({ _id: req.params.id });
  if (!user) {
    throw new NotFound("user-does-not-exist", req, { id: req.params.id });
  }
  res.status(StatusCodes.OK).json({ message: req.t("user-removed") });

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
    throw new NotFound("user-does-not-exist", req, { id: req.params.id });
  }

  res.status(StatusCodes.OK).json(user);
});

// @desc Update User
// @route PATCH /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFound("user-does-not-exist", req, { id: req.params.id });
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
    throw new NotFound("email-not-found", req);
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
      data: req.t("email-sent"),
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new ServerError("email-not-sent", req);
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
    throw new BadRequest("invalid-reset-token", req);
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
    data: req.t("reset-success"),
  });
});

module.exports = {
  registerUser,
  activate,
  authUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
};
