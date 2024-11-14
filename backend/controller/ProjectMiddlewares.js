const { z } = require('zod');
const {User, Project, ProjectUser, Admin} = require("../db/db"); 
const jwt = require("jsonwebtoken");
require("dotenv").config();


async function checkProjectExists(req,res,next){
    //extract project_id from req body and verify schema using zod 
    
    //if request is of type get then do this
    if(req.method=="GET"){
        const schema = z.string().length(36, { message: "project_id must be exactly 36 characters long" });
        const resp=schema.safeParse(req.params.project_id);
        if(!resp.success){
            return res.status(400).json({message:resp.error.errors[0].message});
        }
        //check if project exists
        const project=await Project.findOne({id:req.params.project_id});
        if(!project){
            return res.status(400).json({message:"Project not found"});
        }
        next();
    }else{
        const schema=z.object({
            project_id:z.string().length(36)
        });
        const resp=schema.safeParse(req.body);
        if(!resp.success){
            return res.status(400).json({message:resp.error.errors[0].message});
        }
        //check if project exists
        const project=await Project.findOne({id:req.body.project_id});
        if(!project){
            return res.status(400).json({message:"Project not found"});
        }
        next();
    }
    
}

async function checkUserExists(req,res,next){
    //extract user_id from req body and verify schema using zod 
    const schema=z.object({
        user_id:z.string().length(36)
    });
    const resp=schema.safeParse(req.body);
    if(!resp.success){
        return res.status(400).json({message:resp.error.errors[0].message});
    }
    //check if user exists
    const user=await User.findOne({id:req.body.user_id});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    next();
}

async function checkIfCreator(req,res,next){
    //extract token from header
    const token=req.header("authorization");
    if(!token){
        return res.status(401).json({message:"Please enter a token"});
    }
    //verify token than extract email from token and verify if it exists in User
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findOne({email:decoded.email});
        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        //verify req body to have project_id where project_id is uuid string 
        //using zod
        const schema=z.object({
            project_id:z.string().length(36)
        });
        const resp=schema.safeParse(req.body); 
        if(!resp.success){
            return res.status(400).json({message:resp.error.errors[0].message});
        }
        //check if project exists
        const projectGet=await Project.findOne({id:req.body.project_id});
        if(!projectGet){
            return res.status(400).json({message:"Project not found"});
        }
        //check if this user is the creator of the given project id that is sent in req body
        const project=await Project.findOne({id:req.body.project_id});
        if(project.creator_id!=decoded.email){
            return res.status(401).json({message:"You are not the owner of this project"});
        }
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid token"});
    }
}

async function userAlreadyAdded(req,res,next){
    //extract project_id and user_id from req body and verify schema using zod 
    const schema=z.object({
        project_id:z.string().length(36),
        user_id:z.string().length(36)
    });
    const resp=schema.safeParse(req.body);
    if(!resp.success){
        return res.status(400).json({message:resp.error.errors[0].message});
    }
    //check if user is already added to the project
    const projectUser=await ProjectUser.findOne({project_id:req.body.project_id,user_id:req.body.user_id});
    if(projectUser){
        return res.status(400).json({message:"User already added to the project"});
    }
    next();
}

async function checkUserEmailExists(req,res,next){
    //extract email from jwt token
    const token=req.header("authorization");
    if(!token){
        return res.status(401).json({message:"Please enter a token"});
    }
    //verify token than extract email from token and verify if it exists in User
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findOne({email:decoded.email});
        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid token"});
    }
}

async function checkUserAdminExists(req,res,next){
    //extract email from jwt token
    const token=req.header("authorization");
    if(!token){
        return res.status(401).json({message:"Please enter a token"});
    }
    //verify token than extract email from token and verify if it exists in User
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findOne({email:decoded.email});
        const admin= await Admin.findOne({email:decoded.email});
        if(!admin && !user){
            return res.status(401).json({message:"Admin not found"});
        }
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid token"});
    }
}

module.exports = {
    checkProjectExists,
    checkUserExists,
    checkIfCreator,
    userAlreadyAdded,
    checkUserEmailExists,
    checkUserAdminExists
};
