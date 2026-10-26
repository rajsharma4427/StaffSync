const express = require("express");
const router = express.Router();
const c = require("../controllers/trainingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", c.getTrainings);
router.post("/", authorize("Manager"), c.createTraining);
router.put("/:id", authorize("Manager"), c.updateTraining);
router.delete("/:id", authorize("Manager"), c.deleteTraining);

module.exports = router;
