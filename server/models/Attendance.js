const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave"],
    default: "Present",
  },
});

// One attendance record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
