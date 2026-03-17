import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
const server = createServer(app);
// const io = new Server(server);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
server.listen(9090,()=>{
  console.log("Socket server created successfully")
})

 io.of("/distributors").on("connection", (socket) => {
  const { id, userDetails } = socket.handshake.query;
  const user = JSON.parse(userDetails);

  console.log("Distributor connected:", user);

  socket.on("disconnect", () => {
    console.log("Distributor disconnected");
  });
});

// Root namespace: donors connect here
io.on("connection", (socket) => {
  const { id, userDetails } = socket.handshake.query;
  const user = JSON.parse(userDetails);

  console.log("Donor connected:", user);

  // Donor sends an order
  socket.on("new_order", (orderData) => {
    console.log("Order received from donor:", orderData);

    // Broadcast ONLY to distributors namespace
    io.of("/distributors").emit("new_order", orderData);
  });

  socket.on("disconnect", () => {
    console.log("Donor disconnected");
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import (done here so that to differentiate it from others)
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter); //reach to users route on /users
//url:https//:localhost:9005/api/v1/users/register

import orderRouter from "./routes/order.routes.js"; //afaile naam rakhne ho(default export vayesi)
app.use("/api/v1/order", orderRouter);

import getData from "./routes/getData.routes.js";
import { useReducer } from "react";
app.use("/api/v1/getData", getData);

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Socket.IO connection event
// io.on('connection', (socket) => {
//   console.log('a user connected');

//   // Emit a notification when a user connects
//   socket.emit('notification', 'Welcome to the app!');

//   // Handle custom events
//   socket.on('customEvent', (data) => {
//     console.log(data);
//     // Handle the event
//   });

//   // Handle disconnect
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

export { app };
