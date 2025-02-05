require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');

// Connect to Database
connectDB();

const app = express();

// CORS configuration
if (!process.env.FRONTEND_URL && process.env.NODE_ENV === 'production') {
    throw new Error('FRONTEND_URL must be defined in production environment');
}

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://mz-prestige.vercel.app'
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie', 'Origin', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: true,
    optionsSuccessStatus: 204
}));

// Other Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('src/public'));

// Routes
app.use('/api', routes);

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});