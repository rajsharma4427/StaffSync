const Training = require("../models/Training");
const { asyncHandler } = require("../middleware/errorMiddleware");

// GET /api/training
//  Manager / HR: all programs, Employee: only programs assigned to them
const getTrainings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "Employee" ? { assignedTo: req.user._id } : {};
  const list = await Training.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name")
    .sort({ date: 1 });
  res.json(list);
});

// POST /api/training   (Manager)
const createTraining = asyncHandler(async (req, res) => {
  const { title, description, date, trainer, assignedTo } = req.body;
  const training = await Training.create({
    title,
    description,
    date,
    trainer,
    assignedTo: Array.isArray(assignedTo) ? assignedTo : [],
    createdBy: req.user._id,
  });
  res.status(201).json(training);
});

// PUT /api/training/:id   (Manager)
const updateTraining = asyncHandler(async (req, res) => {
  const training = await Training.findById(req.params.id);
  if (!training) {
    res.status(404);
    throw new Error("Training program not found");
  }
  ["title", "description", "date", "trainer"].forEach((f) => {
    if (req.body[f] !== undefined) training[f] = req.body[f];
  });
  if (Array.isArray(req.body.assignedTo)) training.assignedTo = req.body.assignedTo;
  await training.save();
  res.json(training);
});

// DELETE /api/training/:id   (Manager)
const deleteTraining = asyncHandler(async (req, res) => {
  const training = await Training.findById(req.params.id);
  if (!training) {
    res.status(404);
    throw new Error("Training program not found");
  }
  await training.deleteOne();
  res.json({ message: "Training program removed" });
});

module.exports = { getTrainings, createTraining, updateTraining, deleteTraining };
