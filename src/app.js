import  express  from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
import { createServer } from 'http';
import { Server } from 'socket.io';
const app=express();
const server = createServer(app);
// const io = new Server(server);
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,   //providing cors to frontend
//     credentials:true

// }))
// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
app.use(cors({
  origin:"https://khana.me/",
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

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('a user connected');

  // Emit a notification when a user connects
  socket.emit('notification', 'Welcome to the app!');

  // Handle custom events
  socket.on('customEvent', (data) => {
    console.log(data);
    // Handle the event
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

export {app}