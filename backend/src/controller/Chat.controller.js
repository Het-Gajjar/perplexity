
import AiService from "../services/Ai.service.js";
import ChatModel from "../model/chat.model.js";
import MessageModel from "../model/message.model.js";

export async function getmessageResponce(req, res) {
    try {
        const { message, chat: chatId } = req.body

        let chat = null;
        let title = null;
        let currentChatId = chatId;

        console.log(message)
        if (!chatId) {
            title = await AiService.generateTitle(message)
            chat = await ChatModel.create({
                user: req.userId,
                title: title
            })
            currentChatId = chat._id;
        }

        const userMessage = await MessageModel.create({
            chat: currentChatId,
            content: message,
            role: "user"
        })

        const allmessage = await MessageModel.find({
            chat: currentChatId
        })

        console.log(allmessage)
        const responseText = await AiService.generateResponce(allmessage)



        const AIMessage = await MessageModel.create({
            chat: currentChatId,
            content: responseText,
            role: "ai"
        })


        return res.status(201).json({ chat, AIMessage, userMessage, response: responseText, title });
    } catch (error) {
        console.error("Error in getmessageResponce:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}

export async function getallchat(req, res) {
    try {
        const chats = await ChatModel.find({
            user: req.userId
        })
        return res.status(200).json({ chats });
    } catch (error) {
        console.error("Error in getallchat:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" })
    }
}
export async function getallmessage(req, res) {
    try {
        const { chatId } = req.params

        const chat = await ChatModel.findOne({
            _id: chatId,
            user: req.userId
        })

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" })
        }
        const messages = await MessageModel.find({
            chat: chatId
        })
        return res.status(200).json({ messages });


    } catch (error) {
        console.error("Error in getallmessage:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" })
    }

}

export async function deletechat(req, res) {

    const { chatId } = req.params

    const chat = await ChatModel.findOne({
        _id: chatId,
        user: req.userId
    })

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" })
    }

    await MessageModel.deleteMany({
        chat: chatId
    })
    await ChatModel.deleteOne({
        _id: chatId,
        user: req.userId
    })
    return res.status(200).json({ message: "Chat deleted successfully" });


}
export default { getmessageResponce, getallchat, getallmessage, deletechat };