const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/auth_middleware");

const {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
} = require("../controllers/userController");

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
