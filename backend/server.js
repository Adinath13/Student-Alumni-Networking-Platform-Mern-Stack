const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Support multiple origins (comma-separated in env variable)
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Make io accessible to our router
app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_chat', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room: ${userId}`);
    });

    socket.on('send_message', (message) => {
        const { receiver } = message;
        const receiverId = receiver?._id || receiver;
        io.to(receiverId).emit('receive_message', message);
    });

    socket.on('typing_start', ({ receiverId, senderId }) => {
        io.to(receiverId).emit('typing_start', { senderId });
    });

    socket.on('typing_stop', ({ receiverId, senderId }) => {
        io.to(receiverId).emit('typing_stop', { senderId });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}. Allowed origins:`, allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/mentor-applications', require('./routes/mentorApplicationRoutes'));
app.use('/api/mentorships', require('./routes/mentorshipRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));


// Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Required for Render deployment

server.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));
