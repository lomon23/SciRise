const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Відкриваємо для всіх портів MVP-стайл
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🟢 Підключився:', socket.id);

  socket.on('join_channel', (channelId) => {
    const room = String(channelId);
    socket.join(room);
    console.log(`📁 ${socket.id} зайшов у канал: ${room}`);
  });

  socket.on('send_message', (data) => {
    const room = String(data.channelId);
    console.log(`✉️ Повідомлення від ${socket.id} в канал ${room}:`, data.message.text);
    // Розсилаємо ВСІМ у кімнаті
    io.to(room).emit('receive_message', data.message);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Відключився:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('✅ Socket.io сервер запущено на порту 3001');
});