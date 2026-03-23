import express from 'express';
import connectDB from './config/database.js';
import cookie from 'cookie-parser';
import AuthRouter from './routes/Auth.routes.js';
import test from './services/Ai.service.js';
import cors from 'cors';
import morgan from 'morgan';
import chatRouter from './routes/chat.routes.js';






const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use(cors(
    {
        origin: "http://localhost:5174",
        credentials: true,
    }
))


app.use(cookie());
app.use('/api/auth', AuthRouter);
app.use('/api/chats', chatRouter);





export default app;