// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { Comment } = require("../db/index");
const multer = require('multer');  
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const {
    tokenValidate,
    messageSchemaCheck
} = require("../middlewares/CommentMiddlewares");
  

router.post("/send-message", tokenValidate, messageSchemaCheck, async (req, res) => {
  try {
      const { project_id, creator_id, content } = req.body;
      
      // Create the base comment object with mandatory fields
      const commentData = {
          project_id,
          creator_id
      };

      // Add optional task_id if it exists
      if (req.body.task_id) {
          commentData.task_id = req.body.task_id;
      }

      // Add content if it exists
      if (content) {
          commentData.content = content;
      }

      // Add file data if it exists in the request
      if (req.body.file) {
          commentData.file_name = req.body.file.fileName;
          commentData.file_type = req.body.file.fileType;
          commentData.file_size = req.body.file.fileSize;
          commentData.file_data = req.body.file.data;  // base64 data
      }

      // Create and save the new comment
      const newComment = new Comment(commentData);
      await newComment.save();

      return res.status(201).json({ 
          success: true,
          message: 'Message sent successfully.',
          comment_id: newComment.id 
      });

  } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.name === 'ValidationError') {
          return res.status(400).json({ 
              success: false,
              message: 'Invalid data provided',
              error: error.message 
          });
      }

      return res.status(500).json({ 
          success: false,
          message: 'Error sending message.',
          error: error.message 
      });
  }
});

// Download route handler
router.get("/download/:id", async (req, res) => {
  try {
      const comment = await Comment.findById(req.params.id);
      
      if (!comment) {
          return res.status(404).json({
              success: false,
              message: "Comment not found"
          });
      }

      if (!comment.file_data) {
          return res.status(404).json({
              success: false,
              message: "No file attached to this comment"
          });
      }

      // Convert base64 to buffer
      const fileBuffer = Buffer.from(comment.file_data, 'base64');

      // Set headers for file download
      res.setHeader('Content-Type', comment.file_type);
      res.setHeader('Content-Disposition', `attachment; filename=${comment.file_name}`);
      res.setHeader('Content-Length', comment.file_size);

      // Send the file
      return res.send(fileBuffer);

  } catch (error) {
      console.error('Error downloading file:', error);
      return res.status(500).json({
          success: false,
          message: "Error downloading file",
          error: error.message
      });
  }
});


module.exports = router;

