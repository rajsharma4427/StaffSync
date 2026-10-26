const Employee = require("../models/Employee");
const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorMiddleware");

// GET /api/employees   (HR)
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees);
});

// GET /api/employees/me   (any logged-in user; returns their employee record if one exists)
const getMyEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    $or: [{ user: req.user._id }, { email: req.user.email }],
  });
  res.json(employee);
});

// PUT /api/employees/me   (employee edits own phone / address)
const updateMyEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({
    $or: [{ user: req.user._id }, { email: req.user.email }],
  });
  if (!employee) {
    res.status(404);
    throw new Error("No employee record found for your account. Ask HR to add you.");
  }
  if (req.body.phone !== undefined) employee.phone = req.body.phone;
  if (req.body.address !== undefined) employee.address = req.body.address;
  await employee.save();
  res.json(employee);
});

// GET /api/employees/:id   (HR)
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  res.json(employee);
});

// POST /api/employees   (HR)
const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, department, position, salary, joinDate, phone, address } = req.body;
  // link to a login account when the email matches
  const linkedUser = email ? await User.findOne({ email: email.toLowerCase() }) : null;
  const employee = await Employee.create({
    user: linkedUser ? linkedUser._id : undefined,
    name,
    email,
    department,
    position,
    salary,
    joinDate,
    phone,
    address,
  });
  res.status(201).json(employee);
});

// PUT /api/employees/:id   (HR)
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  const fields = ["name", "email", "department", "position", "salary", "joinDate", "phone", "address"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) employee[f] = req.body[f];
  });
  await employee.save();
  res.json(employee);
});

// DELETE /api/employees/:id   (HR)
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  await employee.deleteOne();
  res.json({ message: "Employee removed" });
});

module.exports = {
  getEmployees,
  getMyEmployee,
  updateMyEmployee,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
