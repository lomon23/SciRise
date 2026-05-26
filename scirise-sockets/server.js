const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// УСІ socket.on ПОВИННІ БУТИ ТІЛЬКИ ВСЕРЕДИНІ ЦІЄЇ ФУНКЦІЇ
io.on('connection', (socket) => {
  console.log('🟢 Підключився:', socket.id);

  // =======================================
  // ЛОГІКА ЧАТУ
  // =======================================
  socket.on('join_channel', (channelId) => {
    const room = `chat_${channelId}`;
    socket.join(room);
    console.log(`📁 ${socket.id} зайшов у текстовий канал: ${room}`);
  });

  socket.on('send_message', (data) => {
    const room = `chat_${data.channelId}`;
    io.to(room).emit('receive_message', data.message);
  });

  // =======================================
  // ЛОГІКА ДОШКИ
  // =======================================
  socket.on('join_board', (groupId) => {
    const room = `board_${groupId}`;
    socket.join(room);
    console.log(`🖍️ ${socket.id} відкрив дошку групи: ${room}`);
  });

  socket.on('widget_moving', (data) => {
    const room = `board_${data.groupId}`;
    socket.to(room).emit('widget_moved', data.widget);
  });

  socket.on('widget_saved', (data) => {
    const room = `board_${data.groupId}`;
    socket.to(room).emit('widget_updated', data.widget);
  });
  
  socket.on('widget_deleted', (data) => {
    const room = `board_${data.groupId}`;
    socket.to(room).emit('widget_deleted', data.widgetId);
  });

  // =======================================
  // ЛОГІКА ВОЙСУ (WebRTC Signaling)
  // =======================================
  socket.on('join_voice', (roomId) => {
    const room = `voice_${roomId}`;
    socket.join(room);

    // Збираємо всіх, хто ВЖЕ є в цій кімнаті (крім того, хто щойно зайшов)
    const usersInRoom = Array.from(io.sockets.adapter.rooms.get(room) || [])
        .filter(id => id !== socket.id);

    // Відправляємо новачкові список юзерів, яким треба подзвонити
    socket.emit('all_voice_users', usersInRoom);
    console.log(`🎤 ${socket.id} зайшов у войс: ${room}`);
  });
  socket.on('ice_candidate', (payload) => {
    io.to(payload.target).emit('ice_candidate', { 
      candidate: payload.candidate, 
      sender: socket.id 
    });
  });
  socket.on('sending_signal', (payload) => {
    io.to(payload.userToSignal).emit('user_joined', { 
      signal: payload.signal, 
      callerID: payload.callerID 
    });
  });

  socket.on('returning_signal', (payload) => {
    io.to(payload.callerID).emit('receiving_returned_signal', { 
      signal: payload.signal, 
      id: socket.id 
    });
  });

  socket.on('leave_voice', (roomId) => {
    const room = `voice_${roomId}`;
    socket.leave(room);
    socket.to(room).emit('user_left', socket.id);
    console.log(`🔇 ${socket.id} вийшов з войсу: ${room}`);
  });

  // =======================================
  // ВІДКЛЮЧЕННЯ (Оновлене)
  // =======================================
  socket.on('disconnect', () => {
    console.log('🔴 Відключився:', socket.id);
    // Сповіщаємо всі кімнати, де був юзер, що він відвалився
    socket.rooms.forEach(room => {
      if (room.startsWith('voice_')) {
        socket.to(room).emit('user_left', socket.id);
      }
    });
  });

}); // <--- ОСЬ ТУТ ЗАКРИВАЄТЬСЯ io.on, і все працює.

// Запуск сервера йде ПІСЛЯ io.on
server.listen(3001, () => {
  console.log('✅ Socket.io сервер запущено на порту 3001');
});