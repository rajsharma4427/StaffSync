const Leave = require("../models/Leave");
const { asyncHandler } = require("../middleware/errorMiddleware");

// POST /api/leaves   (Employee applies)
const applyLeave = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  if (!startDate || !endDate || !reason) {
    res.status(400);
    throw new Error("Start date, end date and reason are required");
  }
  if (new Date(endDate) < new Date(startDate)) {
    res.status(400);
    throw new Error("End date cannot be before start date");
  }
  const leave = await Leave.create({
    user: req.user._id,
    startDate,
    endDate,
    reason,
  });
  res.status(201).json(leave);
});

// GET /api/leaves/my   (own leaves)
const getMyLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(leaves);
});

// GET /api/leaves   (HR, Manager)
const getAllLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find()
    .populate("user", "name email department")
    .sort({ createdAt: -1 });
  res.json(leaves);
});

// PUT /api/leaves/:id/status   (HR, Manager)  body: { status: "Approved" | "Rejected" }
const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be Approved or Rejected");
  }
  const leave = await Leave.findById(req.params.id);
  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }
  leave.status = status;
  leave.approvedBy = req.user.role; // "HR" or "Manager"
  await leave.save();
  const populated = await leave.populate("user", "name email department");
  res.json(populated);
});

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };
