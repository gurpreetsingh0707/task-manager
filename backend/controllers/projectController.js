const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Task = require('../models/Task');

// GET all projects where user = owner OR member
exports.getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({
        $or: [{ owner: req.user._id }, { 'members.user': req.user._id }]
    })
        .populate('owner', 'name email')
        .populate('members.user', 'name email');
    res.json(projects);
});

// POST create project
exports.createProject = asyncHandler(async (req, res) => {
    const { name, description, deadline } = req.body;
    if (!name) { res.status(400); throw new Error('Name required'); }
    const project = await Project.create({
        name, description, deadline,
        owner: req.user._id,
        members: [{ user: req.user._id, role: 'admin' }]
    });
    res.status(201).json(project);
});

// GET single project
exports.getProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('owner', 'name email')
        .populate('members.user', 'name email');
    if (!project) { res.status(404); throw new Error('Not found'); }
    res.json(project);
});

// PUT update project (admin only )
exports.updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(project);
});

// DELETE project (admin only)
exports.deleteProject = asyncHandler(async (req, res) => {
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
});

// Add member
exports.addMember = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    const { userId, role } = req.body;
    const exists = project.members.find(m => m.user.toString() === userId);
    if (exists) { res.status(400); throw new Error('Already member'); }
    project.members.push({ user: userId, role: role || 'member' });
    await project.save();
    res.json(project);
});

// DELETE member
exports.removeMember = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    project.members = project.members.filter(
        m => m.user.toString() !== req.params.uid
    );
    await project.save();
    res.json(project);
});