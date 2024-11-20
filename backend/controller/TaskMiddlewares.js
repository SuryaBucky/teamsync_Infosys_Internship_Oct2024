const { z } = require('zod');
const { Task, Project,User, ProjectUser,ProjectStatistic } = require('../db/index'); // Import necessary models
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware function to create a new task
const createTask = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { title, description, deadline, status, priority, creator_id, assignees, project_name } = req.body;

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
            project_name
        });
        await newTask.save();

        // Update ProjectStatistics for the project
        await updateProjectStatistics(project_id);

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
// Function to update ProjectStatistics
async function updateProjectStatistics(projectId) {
    try {
        // Find existing project statistics for the project
        const projectStat = await ProjectStatistic.findOne({ project_id: projectId });

        if (projectStat) {
            // Increment the total task count
            projectStat.total_tasks += 1;
            // Update completion percentage
            projectStat.completion_percentage = 
                projectStat.total_tasks > 0
                    ? (projectStat.completed_tasks / projectStat.total_tasks) * 100
                    : 0;
            await projectStat.save();
        } else {
            // Create a new entry if no statistics exist for the project
            await ProjectStatistic.create({
                project_id: projectId,
                total_tasks: 1,
                completed_tasks: 0
            });
        }
    } catch (error) {
        console.error('Error updating project statistics:', error);
    }
}

const viewTasksByProject = async (req, res) => {
    try {
        const { project_id } = req.params;

        // Find all tasks associated with the provided project ID
        const tasks = await Task.find({ project_id })

        if (!tasks || tasks.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Middleware for adding an assignee to a task
const addAssignee = async (req, res) => {
    try {
        const { task_id } = req.params; // Extract task ID from URL parameters
        const { assignee_ids } = req.body; // Extract assignee ID from request body

        if (!Array.isArray(assignee_ids) || assignee_ids.length === 0) {
            return res.status(400).json({ message: 'Assignee IDs are required and should be an array' });
        }


        // Find the task by its ID
        const task = await Task.findOne({id:task_id});
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if assignees exists and if the assignee is already added to the task
        if (task.assignees && Array.isArray(task.assignees) && task.assignees.includes(assignee_ids)) {
            return res.status(400).json({ message: 'Assignee already added to the task' });
        }

        if (!task.assignees || !Array.isArray(task.assignees)) {
            task.assignees = [];
        }

        // Add only unique IDs that are not already in task.assignees
        const newAssignees = assignee_ids.filter(id => !task.assignees.includes(id));
        task.assignees.push(...newAssignees);
        
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

// middleware for updating task details
const editTaskDetails = async (req, res) => {
    try {
        const { task_id } = req.params;
        const { title, description, priority, deadline, status } = req.body;

        // Find the task by its ID
        const task = await Task.findById(task_id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if any provided values are different from current values
        const updates = {};
        let hasChanges = false;

        if (description !== undefined && description !== task.description) {
            updates.description = description;
            hasChanges = true;
        }

        if (title !== undefined && title !== task.title) {
            updates.title = title;
            hasChanges = true;
        }

        if (priority !== undefined && priority !== task.priority) {
            updates.priority = priority;
            hasChanges = true;
        }

        if (deadline !== undefined) {
            if (task.deadline !== deadline) {
                updates.deadline = deadline;
                hasChanges = true;
            }
        }

        if (status !== undefined && status !== task.status) {
            updates.status = status;
            hasChanges = true;
        }

        if (!hasChanges) {
            return res.status(400).json({ 
                message: 'No changes detected. All provided values are the same as current values.' 
            });
        }

        // Apply updates and save
        Object.assign(task, updates);
        task.updated_at = new Date();
        await task.save();// This will trigger the pre-save middleware if status has changed

        return res.status(200).json({
            message: 'Task updated successfully',
            task,
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};
// Middleware for deleting a task
const deleteTask = async (req, res) => {
    try {
        const { project_id } = req.params; // Extract project ID from URL parameters
        const {task_id} = req.body;//Extract task ID from request body

        // Find the task by its ID and ensure it belongs to the specified project
        const task = await Task.findOne({ id: task_id, project_id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or does not belong to the specified project' });
        }

        // Delete the task
        await Task.deleteOne({ id: task_id });

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
        const { userEmail } = req.params;

        // Find tasks where the user is the creator
        const tasks = await Task.find({ creator_id: userEmail });

        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks created by user:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Middleware for fetching tasks associated with a user
const   getTasksAssignedToUser = async (req, res) => {
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

const getAssignedUsers=async(req,res)=>{
    try {
        const { task_id } = req.params;
        if(!task_id){
            return res.status(400).json({message:"Task ID is required"});
        }

        const task= await Task.findOne({id:task_id});
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        const assignees=task.assignees;

        if(!assignees || assignees.length===0){
            return res.status(200).json([]);
        }
        const users=await User.find({id:{$in:assignees}});
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching assigned users:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}


module.exports = {
    createTask,
    viewTasksByProject,
    addAssignee,
    editTaskDetails,
    deleteTask,
    getTasksCreatedByUser,
    getTasksAssignedToUser,
    getAssignedUsers
};
