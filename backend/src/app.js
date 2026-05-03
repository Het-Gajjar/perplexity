import express from 'express';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import AuthRouter from './routes/Auth.routes.js';
import cors from 'cors';
import morgan from 'morgan';
import chatRouter from './routes/chat.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: (origin, callback) => {
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5174',
      'http://localhost:5173',
      'https://query-nova-l5exods56-het-gajjars-projects-259133d0.vercel.app',
      'https://query-nova-ai.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));



// Cookies
app.use(cookieParser());

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/chats', chatRouter);

// Test route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;