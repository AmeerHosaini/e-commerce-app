const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/auth_middleware");

const {
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
} = require("../controllers/userController");

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .patch(protect, updateUserProfile);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .patch(protect, admin, updateUser);

router.route("/forgotpassword").post(forgotPassword);
router.route("/passwordreset/:resetToken").put(resetPassword);

module.exports = router;
