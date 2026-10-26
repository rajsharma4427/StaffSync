const express = require("express");
const router = express.Router();
const c = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", c.getAnnouncements);
router.post("/", authorize("HR", "Manager"), c.createAnnouncement);
router.delete("/:id", authorize("HR", "Manager"), c.deleteAnnouncement);

module.exports = router;
