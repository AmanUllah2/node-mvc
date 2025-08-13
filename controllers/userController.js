const User = require("../models/user");

// GET all users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// CREATE a user
exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.status(201).json(user);
};
