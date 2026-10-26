const Announcement = require("../models/Announcement");
const { asyncHandler } = require("../middleware/errorMiddleware");

// GET /api/announcements   (everyone; filtered by audience)
const getAnnouncements = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === "Employee") filter = { targetAudience: { $in: ["All", "Employees"] } };
  if (req.user.role === "Manager") filter = { targetAudience: { $in: ["All", "Managers"] } };
  // HR sees everything
  const list = await Announcement.find(filter)
    .populate("createdBy", "name role")
    .sort({ createdAt: -1 });
  res.json(list);
});

// POST /api/announcements   (HR, Manager)
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, targetAudience } = req.body;
  const announcement = await Announcement.create({
    title,
    message,
    targetAudience,
    createdBy: req.user._id,
  });
  res.status(201).json(announcement);
});

// DELETE /api/announcements/:id   (HR, or the Manager who posted it)
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }
  const isOwner = announcement.createdBy.toString() === req.user._id.toString();
  if (req.user.role !== "HR" && !isOwner) {
    res.status(403);
    throw new Error("You can only delete your own announcements");
  }
  await announcement.deleteOne();
  res.json({ message: "Announcement removed" });
});

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
