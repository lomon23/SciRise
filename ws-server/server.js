const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Базовий мідлвар
app.use(cors());
app.use(express.json());

// Створюємо HTTP сервер, бо Socket.io має сидіти поверх нього
const server = http.createServer(app);

// Налаштовуємо Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Дозволяємо тільки твоєму фронту
        methods: ["GET", "POST"]
    }
});

// Слухаємо підключення
io.on('connection', (socket) => {
    console.log(`🟢 Користувач підключився: ${socket.id}`);

    // Тут потім буде логіка приєднання до кімнат (Спейсів)
    // socket.on('join-room', (roomId) => { ... })

    socket.on('disconnect', () => {
        console.log(`🔴 Користувач відключився: ${socket.id}`);
    });
});

// Простий ендпоінт перевірити, чи живий сервер
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'WebSocket Server is running' });
});

const PORT = 3001; // Не 8000 (там Джанго) і не 5173 (там Vite)

server.listen(PORT, () => {
    console.log(`🚀 WebSocket сервер запущено на http://localhost:${PORT}`);
});