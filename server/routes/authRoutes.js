const express = require("express");
const router = express.Router();
const { register, login, getMe, updateMe, getUsers } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/users", protect, authorize("HR", "Manager"), getUsers);

module.exports = router;
