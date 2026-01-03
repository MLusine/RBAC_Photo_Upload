const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const {
  authMiddleware,
  verifyToken,
} = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
const { sendInviteEmail } = require("../utils/sendEmail");
const multer = require("multer");
const upload = multer({ dest: "uploads/photos/" });
const User = require("../models/user");

console.log(" Loading userRoutes");


router.post("/invite", verifyToken, isAdmin, async (req, res) => {
  const { email } = req.body;

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "User already invited or exists" });

  const INVITE_TOKEN = process.env.INVITE_TOKEN

  const user = new User({ email, inviteToken: INVITE_TOKEN, status: "invited" });
  await user.save();

  await sendInviteEmail(email, INVITE_TOKEN);

  return res.status(200).json({
    message: "Invite sent!",
    INVITE_TOKEN,
  });
});

router.post("/register/:token", upload.single("avatar"), async (req, res) => {
  const { token } = req.params;
  const { password, name, surname, phone } = req.body;
  const avatar = req.file ? req.file.path : null;

  try {
    const user = await User.findOne({ inviteToken: token, status: "invited" });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.name = name;
    user.surname = surname;
    user.phone = phone;
    user.status = "active";
    user.inviteToken = undefined;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({ message: "Registration complete" });
  } catch (err) {

    res.status(500).json({ message: "Error saving user" });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, surname } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { name, surname });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
