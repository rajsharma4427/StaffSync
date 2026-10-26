const express = require("express");
const router = express.Router();
const c = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

// own record (must come before "/:id")
router.get("/me", c.getMyEmployee);
router.put("/me", c.updateMyEmployee);

// HR only
router.get("/", authorize("HR"), c.getEmployees);
router.post("/", authorize("HR"), c.createEmployee);
router.get("/:id", authorize("HR"), c.getEmployee);
router.put("/:id", authorize("HR"), c.updateEmployee);
router.delete("/:id", authorize("HR"), c.deleteEmployee);

module.exports = router;
