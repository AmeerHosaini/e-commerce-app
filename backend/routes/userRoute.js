const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth_middleware");

const {
  authUser,
  getUserProfile,
  registerUser,
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", authUser);
router.route("/profile").get(protect, getUserProfile);

module.exports = router;
