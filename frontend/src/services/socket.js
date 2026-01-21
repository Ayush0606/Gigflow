import io from 'socket.io-client'

let socket = null;
let hiredCallback = null;

// Hardcode Socket URL based on environment - NO ENV VARS
let SOCKET_URL = 'https://gigflow-bd.onrender.com'

// Override ONLY if running locally
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  SOCKET_URL = 'http://localhost:4000'
}

console.log('🔌 Socket URL:', SOCKET_URL)

export const initSocket = (userId) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('🔗 Connected to server with socket ID:', socket.id);
    // Register this user's socket
    if (userId) {
      socket.emit('register', userId);
      console.log('📝 Registered user:', userId);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected from server:', reason);
  });

  socket.on('error', (error) => {
    console.error('⚠️ Socket error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error('⚠️ Connection error:', error);
  });

  // Listen for hired notifications and call registered callback
  socket.on('hired', (data) => {
    console.log('🎉 Received hire notification:', data);
    if (hiredCallback) {
      hiredCallback(data);
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const onHired = (callback) => {
  hiredCallback = callback;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
