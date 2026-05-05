const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: get user's role in the project
const getRole = async (projectId, user) => {
    if (user.role === 'admin') return 'admin'; // super admin fallback
    const project = await Project.findById(projectId);
    if (!project) return null;
    if (project.owner.toString() === user._id.toString()) return 'admin';
    const member = project.members.find(m => m.user.toString() === user._id.toString());
    return member ? member.role : null;
};

// GET all tasks in project
exports.getProjectTasks = asyncHandler(async (req, res) => {
    const role = await getRole(req.params.projectId, req.user);
    if (!role) { res.status(403); throw new Error('No access to this project'); }

    const tasks = await Task.find({ project: req.params.projectId })
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name');
    res.json(tasks);
});

// POST create task
exports.createTask = asyncHandler(async (req, res) => {
    const { title, description, project, assignedTo, priority, dueDate, tags } = req.body;
    if (!title || !project) { res.status(400); throw new Error('Title and project required'); }

    const role = await getRole(project, req.user);
    if (!role) { res.status(403); throw new Error('No access'); }
    if (role !== 'admin') { res.status(403); throw new Error('Only admins can create tasks'); }

    const task = await Task.create({
        title, description, project, assignedTo,
        priority, dueDate, tags, createdBy: req.user._id,
    });
    res.status(201).json(task);
});

// PUT update task
exports.updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) { res.status(404); throw new Error('Task not found'); }

    const role = await getRole(task.project, req.user);
    if (!role) { res.status(403); throw new Error('No access'); }
    if (role !== 'admin' && task.assignedTo?.toString() !== req.user._id.toString()) {
        res.status(403); throw new Error('You can only update tasks assigned to you');
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
        .populate('assignedTo', 'name email');
    res.json(updated);
});

// PATCH update status only
exports.updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatus = ['todo', 'in-progress', 'review', 'done'];
    if (!validStatus.includes(status)) {
        res.status(400); throw new Error('Invalid status');
    }

    const task = await Task.findById(req.params.id);
    if (!task) { res.status(404); throw new Error('Task not found'); }

    const role = await getRole(task.project, req.user);
    if (!role) { res.status(403); throw new Error('No access'); }
    if (role !== 'admin' && task.assignedTo?.toString() !== req.user._id.toString()) {
        res.status(403); throw new Error('You can only update tasks assigned to you');
    }

    task.status = status;
    await task.save();
    res.json(task);
});

// DELETE task
exports.deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) { res.status(404); throw new Error('Task not found'); }

    const role = await getRole(task.project, req.user);
    if (role !== 'admin') { res.status(403); throw new Error('Only admins can delete tasks'); }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});