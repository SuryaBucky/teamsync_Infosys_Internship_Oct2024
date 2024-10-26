const { z } = require('zod');
const { Task, Project,User, ProjectUser } = require('../db/index'); // Import necessary models
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Define the Zod schema for creating a task
const TaskCreationSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().optional(),
    deadline: z.string().optional(),
    status: z.enum(['0', '1','2'], { message: 'Status must be 0 (to do) or 1 (in progress) or 2(completed)' }),
    priority: z.enum(['0', '1', '2'], { message: 'Priority must be 0 (low), 1 (medium), or 2 (high)' }),
    creator_id: z.string().min(1, { message: 'Creator ID is required' }),
    assignees: z.array(z.string()).optional(),
});
// Define Zod schema for adding an assignee
const AddAssigneeSchema = z.object({
    assignee_id: z.string().min(1, { message: 'Assignee ID is required' })
});


// Schema for validating the deadline update
const UpdateDeadlineSchema = z.object({
    deadline: z.string().min(1, { message: 'Deadline is required' }),
});

// Define a schema for the edit details validation
const EditTaskDetailsSchema = z.object({
    description: z.string().optional(),
    priority: z.enum(['0', '1', '2']).optional(), // '0' = low, '1' = medium, '2' = high
}).refine(data => data.description !== undefined || data.priority !== undefined, {
    message: 'At least one of description or priority must be provided',
});

// Define a schema for status validation
const UpdateStatusSchema = z.object({
    status: z.enum(['0', '1','2'], { message: 'Status must be 0 (to do) or 1 (in progress) or 2(completed)' })
});

// Middleware function for validating task creation inputs
const validateTaskCreation = async (req, res, next) => {
    try {
        // Validate the request body against the schema
        TaskCreationSchema.parse(req.body);
        const { title } = req.body;
        const { project_id } = req.params;

         //extract token from header verifyif valid and user is a part of the project using ProjectUser table
         const token = req.headers.authorization;
         if(!token){
             return res.status(401).json({message:"Token not found"});
         }
         //decode token using env jwt secret
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         if(!decoded){
             return res.status(401).json({message:"Invalid token"});
         }
         //get user_id from decoded token
         const user_id = decoded.user_id;
         //check if user is a part of the project
         const projectUser = await ProjectUser.findOne({ project_id, user_id });
         if (!projectUser) {
             return res.status(403).json({ message: 'User is not part of this project' });
         }

        // Check if a task with the same title already exists in the specified project
        const existingTask = await Task.findOne({ title, project_id });

        if (existingTask) {
            return res.status(400).json({ message: 'A task with this title already exists in the specified project' });
        }


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
        const project = await Project.findOne({ id: project_id, is_approved: true });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or not approved' });
        }

        // Validate assignees - Check if each ID is a valid User ID
        if (assignees && assignees.length > 0) {
            const validAssignees = await User.find({ id: { $in: assignees } }, { id: 1 });
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

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this project.' });
        }

        return res.status(200).json(tasks);
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

// Middleware for validating the deadline update input
const validateUpdateDeadline = (req, res, next) => {
    try {
        // Validate the request body against the schema
        UpdateDeadlineSchema.parse(req.body);
        next(); // Proceed if valid
    } catch (error) {
        // If validation fails, return an error response
        return res.status(400).json({ message: error.errors });
    }
};

const updatedeadline = async (req, res) => {
    try {
        const { task_id } = req.params;
        const { deadline } = req.body;

        // Find the task by its ID
        const task = await Task.findById(task_id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the deadline and save the task
        task.deadline = new Date(deadline);
        task.updated_at = new Date(); // Update the `updated_at` field
        await task.save();

        return res.status(200).json({
            message: 'Deadline updated successfully',
            task,
        });
    } catch (error) {
        console.error('Error updating deadline:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const validateEditDetails = (req, res, next) => {
    try {
        // Validate the request body against the schema
        EditTaskDetailsSchema.parse(req.body);
        next(); // Proceed if valid
    } catch (error) {
        // If validation fails, return an error response
        return res.status(400).json({ message: error.errors });
    }
};

// Middleware for updating task details
const editTaskDetails = async (req, res) => {
    try {
        const { task_id } = req.params; // Extract task ID from URL parameters
        const { description, priority } = req.body;

        // Find the task by its ID
        const task = await Task.findById(task_id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the new description and priority are the same as the existing ones
        const isSameDescription = description ? task.description === description : true;
        const isSamePriority = priority ? task.priority === priority : true;

        if (isSameDescription && isSamePriority) {
            return res.status(400).json({ message: 'No changes detected. Description and priority are the same as the current values.' });
        }

        // Update the fields that are provided and have changed
        if (description && !isSameDescription) {
            task.description = description;
        }
        if (priority && !isSamePriority) {
            task.priority = priority;
        }

        // Save the updated task
        task.updated_at = new Date(); // Update the `updated_at` field
        await task.save();

        return res.status(200).json({
            message: 'Task details updated successfully',
            task,
        });
    } catch (error) {
        console.error('Error updating task details:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Middleware to validate status update request
const validateStatusUpdate = (req, res, next) => {
    try {
        // Validate the request body against the schema
        UpdateStatusSchema.parse(req.body);
        next(); // Proceed to the next middleware or route handler if valid
    } catch (error) {
        // If validation fails, return a 400 error with details
        return res.status(400).json({ message: error.errors });
    }
};

// Middleware for updating the task status
const updateStatus = async (req, res) => {
    try {
        const { task_id } = req.params; // Extract the task ID from the URL parameters
        const { status } = req.body; // Extract the new status from the request body

        // Find the task by its ID
        const task = await Task.findById(task_id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the new status is the same as the existing one
        if (task.status === status) {
            return res.status(400).json({ message: 'The provided status is the same as the current status' });
        }

        // Update the status of the task
        task.status = status;
        task.updated_at = new Date(); // Update the `updated_at` field
        await task.save();

        return res.status(200).json({
            message: 'Status updated successfully',
            task
        });
    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware for deleting a task
const deleteTask = async (req, res) => {
    try {
        const { project_id } = req.params; // Extract project ID from URL parameters
        const {task_id} = req.body;//Extract task ID from request body

        // Find the task by its ID and ensure it belongs to the specified project
        const task = await Task.findOne({ _id: task_id, project_id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or does not belong to the specified project' });
        }

        // Delete the task
        await Task.deleteOne({ _id: task_id });

        return res.status(200).json({
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Middleware for fetching tasks created by a user
const getTasksCreatedByUser = async (req, res) => {
    try {
        const { user_id } = req.params; // Extract user ID from URL parameters

        // Find tasks where the user is the creator
        const tasks = await Task.find({ creator_id: user_id });

        return res.status(200).json({
            message: 'Tasks created by user retrieved successfully',
            tasks
        });
    } catch (error) {
        console.error('Error fetching tasks created by user:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Middleware for fetching tasks associated with a user
const getTasksAssignedToUser = async (req, res) => {
    try {
        const { user_id } = req.params; // Extract user ID from URL parameters

        // Find tasks where the user is an assignee
        const tasks = await Task.find({ assignees: user_id });

        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks assigned to user:', error);
        return res.status(500).json({
            message: 'Internal server error '
        });
    }
};


module.exports = {
    validateTaskCreation,
    createTask,
    viewTasksByProject,
    validateAddAssignee,
    addAssignee,
    validateUpdateDeadline,
    updatedeadline,
    validateEditDetails,
    editTaskDetails,
    validateStatusUpdate,
    updateStatus,
    deleteTask,
    getTasksCreatedByUser,
    getTasksAssignedToUser
};
