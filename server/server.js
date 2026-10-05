import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { Message } from './models/Message.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import talentRoutes from './routes/talentRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io Server
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// Body Parser Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/verifications', verificationRoutes);

// Base Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'TalentX Backend REST & Socket.io Live Server (MERN) is Running',
    version: '1.0.0',
    endpoints: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/jobs',
      '/api/talents',
      '/api/proposals',
      '/api/contracts',
      '/api/ai/match'
    ]
  });
});

// -------------------------------------------------------------
// SOCKET.IO REAL-TIME COMMUNICATION ENGINE
// -------------------------------------------------------------
// Online users map: userId -> Set of socket.id
const onlineUsers = new Map();

const getOnlineUserIds = () => Array.from(onlineUsers.keys());

io.on('connection', (socket) => {
  let authenticatedUserId = null;

  // 1. User Connect & Register Presence
  socket.on('register_user', (rawUserId) => {
    if (!rawUserId) return;
    const userId = String(rawUserId).trim();
    authenticatedUserId = userId;

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Join dedicated private room for this user
    socket.join(`user:${userId}`);

    // Broadcast updated online list to all connected clients
    io.emit('online_users_updated', getOnlineUserIds());
  });

  // 2. Real-Time Send Direct Message
  socket.on('send_direct_message', async (data, callback) => {
    try {
      const {
        clientMsgId,
        senderId,
        senderName,
        senderAvatar,
        receiverId,
        receiverName,
        receiverAvatar,
        text,
        isClient,
        time
      } = data;

      if (!text || !senderId || !receiverId) {
        if (typeof callback === 'function') callback({ success: false, error: 'Invalid message payload' });
        return;
      }

      // Save to MongoDB
      const newMsg = await Message.create({
        senderId: String(senderId),
        senderName: senderName || 'User',
        senderAvatar: senderAvatar || '',
        receiverId: String(receiverId),
        receiverName: receiverName || 'User',
        receiverAvatar: receiverAvatar || '',
        text: String(text).trim(),
        isClient: Boolean(isClient),
        time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      const formatted = newMsg.toObject();
      formatted.id = String(newMsg._id);
      formatted.clientMsgId = clientMsgId || null;

      // Instant delivery to receiver's private room
      io.to(`user:${receiverId}`).emit('receive_direct_message', formatted);
      
      // Deliver to sender's other tabs/sockets (excluding the active sending socket)
      socket.to(`user:${senderId}`).emit('receive_direct_message', formatted);

      if (typeof callback === 'function') {
        callback({ success: true, data: formatted, clientMsgId });
      }
    } catch (err) {
      console.error('Socket send_direct_message error:', err);
      if (typeof callback === 'function') {
        callback({ success: false, error: err.message });
      }
    }
  });

  // 3. Real-Time "Typing..." Indicator
  socket.on('typing', ({ senderId, receiverId, senderName }) => {
    if (!receiverId) return;
    io.to(`user:${receiverId}`).emit('user_typing', {
      senderId: String(senderId),
      senderName: senderName || 'Contact'
    });
  });

  // 4. Real-Time "Stop Typing" Indicator
  socket.on('stop_typing', ({ senderId, receiverId }) => {
    if (!receiverId) return;
    io.to(`user:${receiverId}`).emit('user_stop_typing', {
      senderId: String(senderId)
    });
  });

  // 5. Real-Time Read Receipts
  socket.on('mark_read', ({ senderIds, receiverIds }) => {
    const sList = Array.isArray(senderIds) ? senderIds : [senderIds].filter(Boolean);
    const rList = Array.isArray(receiverIds) ? receiverIds : [receiverIds].filter(Boolean);

    sList.forEach(sId => {
      io.to(`user:${sId}`).emit('messages_marked_read', { senderIds: sList, receiverIds: rList });
    });
  });

  // 6. Disconnect Handler
  socket.on('disconnect', () => {
    if (authenticatedUserId && onlineUsers.has(authenticatedUserId)) {
      const userSockets = onlineUsers.get(authenticatedUserId);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(authenticatedUserId);
      }
    }
    io.emit('online_users_updated', getOnlineUserIds());
  });
});

const PORT = process.env.PORT || 5000;

const startServer = (port) => {
  httpServer.listen(port, () => {
    console.log(`TalentX Server with Socket.io running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${port}`);
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use, trying port ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);
