const { z } = require('zod');
const { Task, Project,User } = require('../db/index'); // Import necessary models

// Define the Zod schema for creating a task
const TaskCreationSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().optional(),
    deadline: z.string().optional(),
    status: z.enum(['0', '1'], { message: 'Status must be 0 (incomplete) or 1 (complete)' }),
    priority: z.enum(['0', '1', '2'], { message: 'Priority must be 0 (low), 1 (medium), or 2 (high)' }),
    creator_id: z.string().min(1, { message: 'Creator ID is required' }),
    assignees: z.array(z.string()).optional(),
});
// Define Zod schema for adding an assignee
const AddAssigneeSchema = z.object({
    assignee_id: z.string().min(1, { message: 'Assignee ID is required' })
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
        const { project_id } = req.params;
        const { title, description, deadline, status, priority, creator_id, assignees } = req.body;

        // Ensure the project exists and is approved before creating a task
        const project = await Project.findOne({ _id: project_id, is_approved: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or not approved' });
        }

        // Validate assignees - Check if each ID is a valid User ID
        if (assignees && assignees.length > 0) {
            const validAssignees = await User.find({ _id: { $in: assignees } }, { _id: 1 });
            const validAssigneeIds = validAssignees.map(user => user._id.toString());

            // Check if any assignee ID is invalid
            const invalidAssignees = assignees.filter(assignee => !validAssigneeIds.includes(assignee));
            if (invalidAssignees.length > 0) {
                return res.status(400).json({
                    message: 'Invalid assignee IDs: ' + invalidAssignees.join(', ')
                });
            }
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
            assignees: assignees || [],
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

const viewTasksByProject = async (req, res) => {
    try {
        const { project_id } = req.params;

        // Find all tasks associated with the provided project ID
        const tasks = await Task.find({ project_id })
            .populate('creator_id', 'name email') // Populate creator details (if needed)
            .populate('assignee_id', 'name email') // Populate assignee details (if needed)
            .lean(); // Use `lean()` to get plain JavaScript objects

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this project.' });
        }

        return res.status(200).json({
            message: 'Tasks retrieved successfully',
            tasks,
        });
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Middleware for validating add-assignee input
const validateAddAssignee = (req, res, next) => {
    try {
        // Validate the request body against the schema
        AddAssigneeSchema.parse(req.body);
        next(); // Proceed if valid
    } catch (error) {
        // If validation fails, return an error response
        console.log("validation failed");
        return res.status(400).json({ message: error.errors });
    }
};

// Middleware for adding an assignee to a task
const addAssignee = async (req, res) => {
    try {
        const { task_id } = req.params; // Extract task ID from URL parameters
        const { assignee_id } = req.body; // Extract assignee ID from request body
        console.log('Task ID:', task_id);
        console.log('Assignee ID:', assignee_id);


        // Find the task by its ID
        const task = await Task.findById(task_id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the assignee is already added to the task
        if (task.assignees.includes(assignee_id)) {
            return res.status(400).json({ message: 'Assignee already added to the task' });
        }

        // Add the assignee ID to the list of assignees
        task.assignees.push(assignee_id);
        task.updated_at = new Date(); // Update the `updated_at` field
        await task.save();

        return res.status(200).json({
            message: 'Assignee added successfully',
            task
        });
    } catch (error) {
        console.error('Error adding assignee:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};


module.exports = {
    validateTaskCreation,
    createTask,
    viewTasksByProject,
    validateAddAssignee,
    addAssignee
};
