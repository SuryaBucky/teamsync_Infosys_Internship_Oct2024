// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { Admin } = require("../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const {
    tokenValidate,
    messageSchemaCheck
} = require("../middlewares/CommentMiddlewares");


router.post("/test",tokenValidate, messageSchemaCheck, async (req,res)=>{
    //success
    res.json({message:"ok"});
})

module.exports = router;

