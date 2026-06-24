import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import networkRoutes from './routes/networkRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import Message from './models/Message.js';
import Conversation from './models/Conversation.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Database connection
const PORT = process.env.PORT || 5000;

if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.warn('MONGO_URI is not defined. Starting server without DB connection.');
}

// Socket.io Logic
const userSocketMap = {}; // { userId: socketId }

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  // Handle incoming message
  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId]
        });
      }

      const newMessage = new Message({
        conversationId: conversation._id,
        sender: senderId,
        text
      });

      await newMessage.save();

      conversation.lastMessage = {
        text,
        sender: senderId,
        seen: false
      };
      await conversation.save();

      // Emit to receiver if online
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', newMessage);
      }
      // Emit back to sender to confirm
      socket.emit('newMessage', newMessage);
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
