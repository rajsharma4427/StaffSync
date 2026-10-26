const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorMiddleware");

const ROLES = ["HR", "Employee", "Manager"];

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
});

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }
  if (role && !ROLES.includes(role)) {
    res.status(400);
    throw new Error("Role must be HR, Employee or Manager");
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }
  const user = await User.create({ name, email, password, role, department });
  res.status(201).json({ token: generateToken(user._id), user: userPayload(user) });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  res.json({ token: generateToken(user._id), user: userPayload(user) });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/me  (update own name / department)
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.name) user.name = req.body.name;
  if (req.body.department !== undefined) user.department = req.body.department;
  await user.save();
  res.json(userPayload(user));
});

// GET /api/auth/users?role=Employee   (HR, Manager)
const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role && ROLES.includes(req.query.role)) filter.role = req.query.role;
  const users = await User.find(filter).select("-password").sort({ name: 1 });
  res.json(users);
});

module.exports = { register, login, getMe, updateMe, getUsers };
