const express = require("express");
const router = express.Router();
const c = require("../controllers/leaveController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", authorize("Employee"), c.applyLeave);
router.get("/my", c.getMyLeaves);
router.get("/", authorize("HR", "Manager"), c.getAllLeaves);
router.put("/:id/status", authorize("HR", "Manager"), c.updateLeaveStatus);

module.exports = router;
