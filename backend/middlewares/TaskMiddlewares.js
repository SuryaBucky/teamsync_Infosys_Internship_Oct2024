const { z } = require('zod');
const { Task, Project } = require('../db/index'); // Import necessary models

// Define the Zod schema for creating a task
const TaskCreationSchema = z.object({
    project_id: z.string().min(1, { message: 'Project ID is required' }),
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().optional(),
    deadline: z.string().optional(),
    status: z.enum(['0', '1'], { message: 'Status must be 0 (incomplete) or 1 (complete)' }),
    priority: z.enum(['0', '1', '2'], { message: 'Priority must be 0 (low), 1 (medium), or 2 (high)' }),
    creator_id: z.string().min(1, { message: 'Creator ID is required' }),
    assignee_id: z.string().optional(),
});

// Middleware function for validating task creation inputs
const validateTaskCreation = (req, res, next) => {
    try {
        // Validate the request body against the schema
        TaskCreationSchema.parse(req.body);
        next(); // Proceed to the next middleware/route handler if valid
    } catch (error) {
        // If validation fails, return an error response
        return res.status(400).json({ message: error.errors });
    }
};

// Middleware function to create a new task
const createTask = async (req, res) => {
    try {
        const { project_id, title, description, deadline, status, priority, creator_id, assignee_id } = req.body;

        // Ensure the project exists and is approved before creating a task
        const project = await Project.findOne({ _id: project_id, is_approved: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or not approved' });
        }
        const parsedDeadline = deadline ? parse(deadline, 'dd/MM/yyyy', new Date()) : undefined;

        // Validate that the parsed deadline is a valid date
        if (parsedDeadline && isNaN(parsedDeadline)) {
            return res.status(400).json({ message: 'Invalid date format. Please use DD/MM/YYYY.' });
        }

        // Create a new task with the provided data
        const newTask = new Task({
            project_id,
            title,
            description,
            deadline: deadline ? new Date(deadline) : undefined,
            status,
            priority,
            creator_id,
            assignee_id,
        });

        await newTask.save();

        return res.status(201).json({
            message: 'Task created successfully',
            task: newTask,
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

module.exports = {
    validateTaskCreation,
    createTask,
};
