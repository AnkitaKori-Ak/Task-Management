const express = require('express');
require('./config/db');
const userRouter = require('./router/user.router');
const taskRouter = require('./router/task.router')
const commentRoute = require('./router/comment.router')
const cookieParser = require('cookie-parser');

const cors = require('cors');

const app = express();

app.use(cookieParser());
app.use(express.json());


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);



app.use("/api/auth",userRouter);
app.use("/api/task",taskRouter);
app.use("/api/comment",commentRoute);



module.exports = app;
