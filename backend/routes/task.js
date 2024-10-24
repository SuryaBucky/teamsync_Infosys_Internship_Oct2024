const express = require("express");

const { validateTaskCreation, createTask,viewTasksByProject } = require('../middlewares/TaskMiddlewares'); // Import the validation and creation middleware
require("dotenv").config();

const router = express.Router();

router.post('/project/:project_id/create-task', validateTaskCreation, createTask);
router.get('/project/:project_id/view-tasks',viewTasksByProject);

module.exports = router;