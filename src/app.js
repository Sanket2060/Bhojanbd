import { Express } from "express";
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
app.use(express.cookieParser());

export {app}