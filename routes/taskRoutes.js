const express = require("express");
const auth = require("../middleware/authMiddleware");

const router = express.Router();
const {
  listTask,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

router.post("/create", auth, createTask);
router.get("/", auth, listTask);
router.delete("/:id", auth, deleteTask);
router.put("/:id", auth, updateTask);

module.exports = router;
