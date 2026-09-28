import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderAvatar: {
    type: String
  },
  receiverId: {
    type: String,
    required: true
  },
  receiverName: {
    type: String
  },
  receiverAvatar: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  isClient: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  time: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Message = mongoose.model('Message', MessageSchema);
