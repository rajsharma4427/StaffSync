// Creates demo accounts. Run with: npm run seed
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Employee = require("./models/Employee");
const Announcement = require("./models/Announcement");
const Training = require("./models/Training");

const PASSWORD = "123456";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const demo = [
    { name: "Hina HR", email: "hr@demo.com", role: "HR", department: "Human Resources" },
    { name: "Manav Manager", email: "manager@demo.com", role: "Manager", department: "Engineering" },
    { name: "Esha Employee", email: "employee@demo.com", role: "Employee", department: "Engineering" },
  ];

  for (const d of demo) {
    await User.deleteOne({ email: d.email });
    await Employee.deleteOne({ email: d.email });
  }
  await Announcement.deleteMany({ title: "Welcome to StaffSync" });
  await Training.deleteMany({ title: "MongoDB CRUD Basics" });

  const users = {};
  for (const d of demo) {
    users[d.role] = await User.create({ ...d, password: PASSWORD });
  }

  await Employee.create({
    user: users.Employee._id,
    name: "Esha Employee",
    email: "employee@demo.com",
    department: "Engineering",
    position: "Software Developer",
    salary: 50000,
    phone: "9999999999",
    address: "Bhopal, Madhya Pradesh",
  });

  await Announcement.create({
    title: "Welcome to StaffSync",
    message: "This is a demo announcement posted by HR.",
    createdBy: users.HR._id,
    targetAudience: "All",
  });

  await Training.create({
    title: "MongoDB CRUD Basics",
    description: "Hands-on session on MongoDB CRUD operations.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    trainer: "Manav Manager",
    createdBy: users.Manager._id,
    assignedTo: [users.Employee._id],
  });

  console.log("Seed complete. Demo logins (password: " + PASSWORD + "):");
  demo.forEach((d) => console.log(`  ${d.role}: ${d.email}`));
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
