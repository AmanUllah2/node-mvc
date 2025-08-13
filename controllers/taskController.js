const Task = require("../models/tasks");

// create task
exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title?.trim() || !description?.trim()) {
    return res
      .status(400)
      .json({ message: "Title and description is required!" });
  }
  const task = new Task({ title, description, user: req.user._id });
  await task.save();
  return res.status(200).json(task);
};

// list tasks
exports.listTask = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const tasks = await Task.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Total tasks count for user
  const total = await Task.countDocuments({ user: req.user._id });

  res.status(200).json({
    page: page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalTasks: total,
    tasks,
  });
};

// delete task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  // Find the task
  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Check if logged-in user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this task" });
  }

  await task.deleteOne();
  return res.status(200).json({ message: "Task deleted successfully" });
};

// update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  // Find the task
  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Check if logged-in user owns the task
  if (task.user.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this task" });
  }

  if (!title?.trim() && !description?.trim()) {
    return res
      .status(400)
      .json({ message: "Title or description is required!" });
  }

  // Update fields only if provided
  if (title) task.title = title;
  if (description) task.description = description;

  await task.save();

  return res.status(200).json(task);
};
