const { Project, ProjectApproval, User } = require('../db/index'); // Import necessary models


// Middleware function to handle the project approval logic
const approveProject = async (req, res) => {
    try {
        const { project_id, status } = req.body;
        const { adminId } = req.user; // Extract admin ID from the authenticated user

        const project = await Project.findOne({id:project_id});
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        //check if project is already approved
        if(project.is_approved){
            return res.status(400).json({message:"Project is already approved"});
        }

        // Create a new project approval record
        const newApproval = new ProjectApproval({
            project_id,
            admin_id: adminId,
            status,
        });
        await newApproval.save();

        // Update the project's approval status based on the admin's decision
        project.is_approved = status === 'approved';
        await project.save();

        return res.status(200).json({
            message: `Project has been ${status} successfully.`,
            approval: newApproval,
        });
    } catch (error) {
        console.error('Error during project approval:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        
        const users = await User.find(
            { state: { $ne: 'pending' } },
            '-password_hash -registration_otp -reset_otp'
          ).lean();
          
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Middleware function to get all projects with their details
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.aggregate([
            {
                $lookup: {
                    from: 'projecttags', // Name of the tags collection
                    localField: 'id', // Project ID
                    foreignField: 'project_id', // Matching project_id in tags
                    as: 'tags' // The name of the field where the tags will be stored
                }
            },
            {
                $project: {
                    id: 1,
                    name: 1,
                    description: 1,
                    created_at: 1,
                    updated_at: 1,
                    deadline: 1,
                    creator_id: 1,
                    is_approved: 1,
                    status: 1,
                    noUsers: 1,
                    tags: '$tags.tag_name' // Only return the tag names
                }
            }
        ]);

        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching all projects:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};


module.exports = {
    approveProject,
    getAllUsers,
    getAllProjects,
};
