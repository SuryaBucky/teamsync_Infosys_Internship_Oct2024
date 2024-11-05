const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRouter = require("./routes/admin")
const userRouter = require("./routes/user");
const projectRouter = require("./routes/project");
const taskRouter=require("./routes/task");
const commentRouter=require("./routes/comment");
const cors=require("cors");

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(cors());
app.use("/admin", adminRouter)
app.use("/user", userRouter)
app.use("/project", projectRouter)
app.use("/task",taskRouter)
app.use("/comment",commentRouter)

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});