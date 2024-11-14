// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importing Routers
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const taskRouter = require('./routes/task');
const commentRouter = require('./routes/comment');

// Initialize the Express app
const app = express();

// Middleware for parsing JSON bodies and enabling CORS
app.use(bodyParser.json());
app.use(cors());

// Define route handlers
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/comment', commentRouter);

module.exports = app;
