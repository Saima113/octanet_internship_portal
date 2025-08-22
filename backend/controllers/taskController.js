const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Create Task (by logged-in ADMIN, ideally)
const createTask = async (req, res) => {
  try {
    const { title, description, points, difficulty, deadline, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        ...(points !== undefined && { points }),
        ...(difficulty !== undefined && { difficulty }),
        ...(deadline !== undefined && { deadline: new Date(deadline) }),
        ...(status !== undefined && { status }),
        createdBy: req.user.id, // from auth middleware
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get All Tasks (everyone can view)
const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        createdBy: req.user.id  // Only tasks created by the logged-in user
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Task (only creator or admin)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists and belongs to user
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...req.body,
        ...(req.body.deadline && { deadline: new Date(req.body.deadline) })
      }
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Task (only creator or admin)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await prisma.task.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
