import express from "express";

import Identifyuser from "../middleware/Auth.middleware.js";
import ChatController from "../controller/Chat.controller.js";

const chatRouter = express.Router();

chatRouter.post('/message', Identifyuser, ChatController.getmessageResponce)
chatRouter.get('/', Identifyuser, ChatController.getallchat);
chatRouter.get('/:chatId', Identifyuser, ChatController.getallmessage);
chatRouter.delete('/delete/:chatId', Identifyuser, ChatController.deletechat)



export default chatRouter;
