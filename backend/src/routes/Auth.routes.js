import express from 'express';
import AuthController from '../controller/Auth.controller.js';
import userValidator from '../middleware/userValidator.js';
import { Auth } from 'googleapis';
import Identifyuser from '../middleware/Auth.middleware.js';

const Authrouter = express.Router();

Authrouter.post('/register', userValidator.validateRegister, AuthController.register);
Authrouter.get('/verify-email', AuthController.verifyEmail);
Authrouter.post('/login', userValidator.validateLogin, AuthController.login);
Authrouter.get('/getme', Identifyuser, AuthController.getme);
export default Authrouter;

// Define your routes here

