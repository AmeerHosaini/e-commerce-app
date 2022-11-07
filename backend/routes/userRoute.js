const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middlewares/auth_middleware");

const {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
} = require("../controllers/userController");

router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .patch(protect, updateUserProfile);

module.exports = router;
