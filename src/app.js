import express from 'express';
import dotenv from 'dotenv'
import 'reflect-metadata';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import postRouter from './routes/post.routes.js';
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';
import 'reflect-metadata';
import { verifyToken } from './Middlewares/jwt.js';

dotenv.config()

const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());
app.use('/user', userRouter)
app.use('/post', verifyToken,postRouter)
app.use('/comment', verifyToken,commentRouter)
app.use('/like', verifyToken, likeRouter)


const config = JSON.parse(process.env.MY_CONFIG);
app.listen(config, ()=>console.log(`http://${config.hostname}:${config.port}`));