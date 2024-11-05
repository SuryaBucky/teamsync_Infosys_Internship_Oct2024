const { z } = require('zod');
require("dotenv").config();
const { Project,Task,User,ProjectUser } = require("../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Define the schema for fields that are expected in the request body
const CommentZodSchema = z.object({
    project_id: z.string().min(1, "Project ID is required."),
    task_id: z.string().optional(),
    creator_id: z.string().min(1, "Creator ID is required."),
    content: z.string().optional(),
}).refine(
    (data) => data.content || data.file, // Ensure either content or a file is provided
    {
        message: "Either content or a file must be provided.",
        path: ["content", "file"], // Specifies the path in error messages
    }
);

async function tokenValidate(req,res,next){
    //check if token is in headers
    const token = req.headers['authorization'];
    if(!token) return res.status(401).send({message: 'No token found'});
    //check if token is valid
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //extract email from token
        const email = decoded.email;
        //check if user exists
        const user = await User.findOne({email});
        if(!user) return res.status(401).send({message: 'User not found'})
        //get project_id from req body
        const projectId = req.body.project_id;
        //check if project exists
        const project = await Project.findOne({id: projectId});
        if(!project) return res.status(404).send({message: 'Project not found'});
        //check if user is a part of this project
        const projectUser = await ProjectUser.findOne({
            user_id:user.id,
            project_id:projectId
        });
        if(!projectUser) return res.status(401).send({message: 'User is not part of this project'});
        next();
    }catch(err){
        return res.status(401).send({message: 'Invalid token'});
    }
}


//exort
module.exports = {tokenValidate};