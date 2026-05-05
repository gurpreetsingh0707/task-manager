const express = require('express');
const router = express.Router();
const {
    getProjectTasks, createTask,
    updateTask, updateStatus, deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/project/:projectId', protect, getProjectTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.patch('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteTask);

module.exports = router;