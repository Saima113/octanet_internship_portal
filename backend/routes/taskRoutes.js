const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// @desc    Get all tasks
// @route   GET /api/tasks
// Anyone logged in can see tasks
router.get('/', protect, getTasks);

// @desc    Create a new task
// @route   POST /api/tasks
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// Only ADMIN can create, update, delete tasks
router.post('/', protect, authorizeRoles('ADMIN'), createTask);
router.put('/:id', protect, authorizeRoles('ADMIN'), updateTask);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteTask);



module.exports = router;
