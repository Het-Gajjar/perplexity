import app from './src/app.js';
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import http from 'http';
import { initsocket } from './src/sockets/server.socket.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const httpserver = http.createServer(app);
initsocket(httpserver);


connectDB();

httpserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});