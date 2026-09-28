import { Message } from '../models/Message.js';

// @desc    Get all messages (or filtered by userId query)
// @route   GET /api/messages
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) {
      query = {
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ]
      };
    }
    const messages = await Message.find(query).sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a new real-time message
// @route   POST /api/messages
export const sendMessage = async (req, res) => {
  try {
    const { 
      senderId, 
      senderName, 
      senderAvatar, 
      receiverId, 
      receiverName, 
      receiverAvatar, 
      text, 
      isClient, 
      time 
    } = req.body;

    if (!text || !senderId || !receiverId) {
      return res.status(400).json({ success: false, message: 'senderId, receiverId and text are required' });
    }

    const message = await Message.create({
      senderId,
      senderName: senderName || 'User',
      senderAvatar: senderAvatar || '',
      receiverId,
      receiverName: receiverName || 'User',
      receiverAvatar: receiverAvatar || '',
      text,
      isClient: Boolean(isClient),
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark messages between sender and receiver as read
// @route   PUT /api/messages/read/:senderId
export const markAsRead = async (req, res) => {
  try {
    const rawSenderId = req.params.senderId;
    const bodySenderIds = req.body?.senderIds || [rawSenderId];
    const bodyReceiverIds = req.body?.receiverIds || (req.body?.receiverId ? [req.body.receiverId] : []);

    const senderIds = (Array.isArray(bodySenderIds) ? bodySenderIds : [bodySenderIds])
      .flatMap(id => String(id || '').split(','))
      .map(s => s.trim())
      .filter(Boolean);

    const receiverIds = (Array.isArray(bodyReceiverIds) ? bodyReceiverIds : [bodyReceiverIds])
      .flatMap(id => String(id || '').split(','))
      .map(s => s.trim())
      .filter(Boolean);

    let query = { isRead: false };
    if (senderIds.length > 0) {
      query.senderId = { $in: senderIds };
    }
    if (receiverIds.length > 0) {
      query.receiverId = { $in: receiverIds };
    }

    if (senderIds.length > 0 || receiverIds.length > 0) {
      await Message.updateMany(query, { $set: { isRead: true } });
    }

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
