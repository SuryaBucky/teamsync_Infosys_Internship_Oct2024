const { z } = require('zod');
const { Task, Project,User, ProjectUser,ProjectStatistic } = require('../db/index'); // Import necessary models
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
    assignee_ids: z.array(z.string().min(1, { message: 'Assignee ID is required' }))
});



// zod schema for task updates
const EditTaskDetailsSchema = z.object({
    title:z.string().optional(),
    description: z.string().optional(),
    priority: z.enum(['0', '1', '2'], { 
        message: 'Priority must be 0 (low), 1 (medium), or 2 (high)'
    }).optional(),
    deadline: z.string().optional(),
    status: z.enum(['0', '1', '2'], { 
        message: 'Status must be 0 (to do) or 1 (in progress) or 2(completed)'
    }).optional(),
}).refine(data => {
    // Ensure at least one field is provided for update
    return Object.keys(data).length > 0;
}, {
    message: 'At least one field (description, priority, deadline, or status) must be provided'
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

// Middleware for validating add-assignee input
const validateAddAssignee = (req, res, next) => {
    try {
        // Validate the request body against the schema
        AddAssigneeSchema.parse(req.body);
        next(); // Proceed if valid
    } catch (error) {
        // If validation fails, return an error response
        return res.status(400).json({ message: error.errors });
    }
};


// Middleware for validating the task update input
const validateEditDetails = (req, res, next) => {
    try {
        EditTaskDetailsSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: error.errors });
    }
};

module.exports = {
    validateTaskCreation,
    validateAddAssignee,
    validateEditDetails,
};
