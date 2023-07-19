import express from 'express';
import dotenv from 'dotenv'
import userRouter from './routes/user.routes.js';

dotenv.config()

const app=express();

app.use(express.json())
app.use('/user', userRouter)


app.listen(5001, ()=>{
    console.log("server corriendo");
    
})