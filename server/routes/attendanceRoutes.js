const express = require("express");
const router = express.Router();
const c = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/mark", c.markAttendance);
router.put("/checkout", c.checkOut);
router.get("/my", c.getMyAttendance);
router.get("/", authorize("HR", "Manager"), c.getAllAttendance);

module.exports = router;
