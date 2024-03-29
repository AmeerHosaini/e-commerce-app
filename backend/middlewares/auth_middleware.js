const jwt = require("jsonwebtoken");
const { UnAuthenticated } = require("../errors/index");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  // Get the token - token is sent through headers (headers as key and as value, Bearer token)
  const authHeader = req.headers.authorization;

  // check if there is a token
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticated("not-authorized-no-token", req);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select("-password");
    next();
  } catch (error) {
    throw new UnAuthenticated("not-authorized-no-token", req);
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new UnAuthenticated("not-authorized-as-admin", req);
  }
};

module.exports = { protect, admin };
