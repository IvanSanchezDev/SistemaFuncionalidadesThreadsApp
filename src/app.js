import express from 'express';
import dotenv from 'dotenv'
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

dotenv.config()

const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());
app.use('/user', userRouter)


app.listen(5001, ()=>{
    console.log("server corriendo");
    
})