const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");
const { deleteUser } = require("../controllers/userController");
const { isAdmin } = require("../middlewares/roleMiddleware");
const {
  login,
  sendInvite,
  register,
} = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/invite", verifyToken, isAdmin, sendInvite);
router.post("/register/:token", register);

router.delete("/:id", authMiddleware, deleteUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
