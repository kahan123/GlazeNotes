require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Apply Global Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});
app.use(globalLimiter);

// Specific Rate Limiting for Auth & AI
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute for auth routes
    message: { message: "Too many authentication attempts, please try again later" }
});
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // 15 requests per minute for AI routes
    message: { message: "AI rate limit exceeded, please try again in a minute" }
});

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/folders', require('./routes/folderRoutes'));
app.use('/api/ai', aiLimiter, require('./routes/aiRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
