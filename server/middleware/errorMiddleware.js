// Wraps async controllers so errors reach the error handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error";

  if (err.code === 11000) {
    status = 400;
    message = "Duplicate value: " + Object.keys(err.keyValue || {}).join(", ") + " already exists";
  } else if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid id";
  }
  res.status(status).json({ message });
};

module.exports = { asyncHandler, notFound, errorHandler };
