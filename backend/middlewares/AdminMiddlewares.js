const { z } = require('zod');
const { Project, ProjectApproval, User, ProjectUser, Admin } = require('../db/index'); // Import necessary models
const jwt = require('jsonwebtoken');

// Define the Zod schema for admin sign-in
const AdminSignInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

// Define the Zod schema for project approval
const ProjectApprovalSchema = z.object({
    project_id: z.string().min(1, { message: 'Project ID is required' }),
    status: z.enum(['approved', 'rejected'], { message: 'Status must be either "approved" or "rejected"' }),
});

//zod schema for change userstate from blocked to verified and opposite expect user to send user_id in request body
const UserStateSchema = z.object({
    user_id: z.string().min(1, { message: 'User ID is required' }),
});

// Middleware function for validating admin sign-in inputs
const validateAdminSignIn = (req, res, next) => {
    try {
        // Validate the request body against the schema
        AdminSignInSchema.parse(req.body);
        next(); // Proceed to the next middleware/route handler if valid
    } catch (error) {
        // If validation fails, return an error response
        return res.status(400).json({ message: error.errors });
    }
};

// Middleware function for validating project approval inputs
const validateProjectApproval = (req, res, next) => {
    try {
        // Validate the request body against the schema
        ProjectApprovalSchema.parse(req.body);
        next(); // Proceed to the next middleware/route handler if valid
    } catch (error) {
        // If validation fails, return an error response
        return res.status(400).json({ message: error.errors });
    }
};

const tokenValidationAdmin=async(req,res, next)=>{
    try {
        const token = req.header('authorization');
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ email: decoded.email });
        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }
        req.user = { adminId: admin.id }; // Set the authenticated user in the request object
        next();
    } catch (error) {
        console.error('Error validating token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

const tokenValidationUser=async(req,res,next)=>{
    try {
        const token = req.header('authorization');
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = { userId: user.id }; // Set the authenticated user in the request object
        next();
    } catch (error) {
        console.error('Error validating token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

async function validateUserStateChange(req,res,next){
    try {
        //safe parse use
        UserStateSchema.parse(req.body)
        //find if user exists
        const user = await User.findOne({ id: req.body.user_id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(400).json({ message: error.errors });
    }
}

module.exports = {
    validateAdminSignIn,
    validateProjectApproval,
    tokenValidationAdmin,
    tokenValidationUser,
    validateUserStateChange
};
