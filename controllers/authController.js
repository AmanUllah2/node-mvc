const User = require("../models/user");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  const exists = await User.findOne({ email });
  console.log("email", email);
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(401).json({
    user: { _id: user._id, name: user.name, email: user.email },
    token,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "Email and Password is required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const token = await generateToken(user._id);

  return res
    .status(401)
    .json({ message: "Logged in Successfully", user, token });
};
