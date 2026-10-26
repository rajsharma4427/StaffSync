const Attendance = require("../models/Attendance");
const { asyncHandler } = require("../middleware/errorMiddleware");

// start of today in UTC, so one record per day
const today = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// POST /api/attendance/mark   (check in)
const markAttendance = asyncHandler(async (req, res) => {
  const date = today();
  const existing = await Attendance.findOne({ user: req.user._id, date });
  if (existing) {
    res.status(400);
    throw new Error("Attendance already marked for today");
  }
  const record = await Attendance.create({
    user: req.user._id,
    date,
    checkIn: new Date(),
    status: "Present",
  });
  res.status(201).json(record);
});

// PUT /api/attendance/checkout   (check out)
const checkOut = asyncHandler(async (req, res) => {
  const record = await Attendance.findOne({ user: req.user._id, date: today() });
  if (!record) {
    res.status(400);
    throw new Error("You have not marked attendance today");
  }
  if (record.checkOut) {
    res.status(400);
    throw new Error("Already checked out today");
  }
  record.checkOut = new Date();
  await record.save();
  res.json(record);
});

// GET /api/attendance/my
const getMyAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
  res.json(records);
});

// GET /api/attendance   (HR, Manager)
const getAllAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find()
    .populate("user", "name email department")
    .sort({ date: -1 });
  res.json(records);
});

module.exports = { markAttendance, checkOut, getMyAttendance, getAllAttendance };
