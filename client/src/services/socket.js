// TalentX Socket.io Real-Time Client Service

import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

// Pleasant Web Audio API Notification Sound (Synthesized without external audio files)
export const playNotificationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Two-tone bell melody (880Hz -> 1320Hz)
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (err) {
    // AudioContext permission ignored
  }
};

/**
 * Connect to Socket.io Server and Register Current User
 */
export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      if (userId) {
        socket.emit('register_user', String(userId));
      }
    });
  } else if (socket.connected && userId) {
    socket.emit('register_user', String(userId));
  }

  return socket;
};

/**
 * Disconnect Socket Session (e.g. On Logout)
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get Active Socket Instance
 */
export const getSocket = () => socket;

/**
 * Send Direct Message via WebSocket
 */
export const emitDirectMessage = (messageData) => {
  return new Promise((resolve) => {
    if (socket && socket.connected) {
      socket.emit('send_direct_message', messageData, (response) => {
        resolve(response);
      });
    } else {
      resolve({ success: false, error: 'Socket not connected' });
    }
  });
};

/**
 * Emit User Typing Event
 */
export const emitTyping = (senderId, receiverId, senderName) => {
  if (socket && socket.connected && receiverId) {
    socket.emit('typing', { senderId, receiverId, senderName });
  }
};

/**
 * Emit User Stopped Typing Event
 */
export const emitStopTyping = (senderId, receiverId) => {
  if (socket && socket.connected && receiverId) {
    socket.emit('stop_typing', { senderId, receiverId });
  }
};

/**
 * Emit Read Status via Socket
 */
export const emitMarkRead = (senderIds, receiverIds) => {
  if (socket && socket.connected) {
    socket.emit('mark_read', { senderIds, receiverIds });
  }
};
