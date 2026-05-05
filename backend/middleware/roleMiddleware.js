const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');

const requireProjectAdmin = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error('Project not found'); }

  const isOwner  = project.owner.toString() === req.user._id.toString();
  const member   = project.members.find(m => m.user.toString() === req.user._id.toString());
  const isAdmin  = member?.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403); throw new Error('Admins only');
  }
  req.project = project;
  next();
});

module.exports = { requireProjectAdmin };