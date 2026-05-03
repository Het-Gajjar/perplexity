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
  origin: true, // dynamically allow frontend (Vercel + localhost)
  credentials: true,
}));

// ✅ Handle preflight requests
app.options("/*", cors());
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