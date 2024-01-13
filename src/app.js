import  express  from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,   //providing cors to frontend
    credentials:true

}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static("public"));
app.use(cookieParser());


//routes import (done here so that to differentiate it from others)
import userRouter from './routes/user.routes.js'
app.use('/api/v1/users',userRouter)  //reach to users route on /users
//url:https//:localhost:9005/api/v1/users/register

import orderRouter from './routes/order.routes.js'  //afaile naam rakhne ho(default export vayesi)
app.use('/api/v1/order',orderRouter);

import getData from './routes/getData.routes.js'
app.use('/api/v1/getData',getData)
export {app}