const express = require("express");
const { uploadAvatarController } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig");

const router = express.Router();

console.log(" Loading photoRoutes");

router.post("/", verifyToken, upload.single("avatar"), uploadAvatarController);

module.exports = router;
