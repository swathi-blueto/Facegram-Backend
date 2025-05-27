import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

import adminRoutes from "./routes/adminRoutes.js"

dotenv.config();
const app = express();
const server = http.createServer(app);



const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/chats",chatRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/notifications",notificationRoutes)



server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
