const express = require("express");
// Import the validation and creation middleware
require("dotenv").config();
const { validateTaskCreation, createTask,viewTasksByProject,validateAddAssignee,addAssignee,
    validateEditDetails,editTaskDetails,
    deleteTask , getTasksCreatedByUser, getTasksAssignedToUser} = require('../middlewares/TaskMiddlewares'); 

const router = express.Router();

router.post('/project/:project_id/create-task', validateTaskCreation, createTask);

router.get('/project/:project_id/view-tasks',viewTasksByProject);

router.post('/:task_id/add-assignee', validateAddAssignee, addAssignee);


router.put('/:task_id/edit-details', validateEditDetails,editTaskDetails);


// Route for deleting a task from a project
router.delete('/project/:project_id/delete-task', deleteTask);

// Route for getting tasks created by the user
router.get('/user/:userEmail/created-tasks', getTasksCreatedByUser);

// Route for getting tasks assigned to the user
router.get('/user/:user_id/assigned-tasks', getTasksAssignedToUser);


module.exports = router;