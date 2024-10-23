const express = require("express");

const { validateTaskCreation, createTask } = require('../middlewares/TaskMiddlewares'); // Import the validation and creation middleware
require("dotenv").config();

const router = express.Router();

router.post('/create-task', validateTaskCreation, createTask);

module.exports = router;