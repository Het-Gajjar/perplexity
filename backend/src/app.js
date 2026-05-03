import express from 'express';
import connectDB from './config/database.js';
import cookie from 'cookie-parser';
import AuthRouter from './routes/Auth.routes.js';
import cors from 'cors';
import morgan from 'morgan';
import chatRouter from './routes/chat.routes.js';

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5174",
  "https://query-nova-ai.vercel.app",
  "https://query-nova-l5exods56-het-gajjars-projects-259133d0.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.options("*", cors());

app.use(cookie());

app.use('/api/auth', AuthRouter);
app.use('/api/chats', chatRouter);

export default app;