const router = require('express').Router();
const {
    getProjects, createProject, getProject,
    updateProject, deleteProject, addMember, removeMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { requireProjectAdmin } = require('../middleware/roleMiddleware');

router.use(protect); // all project routes need login

router.route('/')
    .get(getProjects)
    .post(createProject);

router.route('/:id')
    .get(getProject)
    .put(requireProjectAdmin, updateProject)
    .delete(requireProjectAdmin, deleteProject);

router.route('/:id/members')
    .post(requireProjectAdmin, addMember);

router.delete('/:id/members/:uid', requireProjectAdmin, removeMember);

module.exports = router;