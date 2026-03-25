import { initializeSocket } from "../services/chat.socket"
import { sendMessage, getallchats, getallmessages } from "../services/chat.api"
import { useDispatch } from "react-redux"
import { setCurrentChat, setLoading, setError, addMessages, createChat, setChats } from "../chat.slice"

export const useChat = () => {

    const dispatch = useDispatch()


    const handleSendMessage = async (message, chatId) => {
        try {
            console.log(chatId)
            dispatch(setLoading(true))
            const response = await sendMessage(message, chatId);
            const { chat, AIMessage, title: responseTitle } = response;
            const resolvedChatId = chatId || chat._id;

            // If it's a new chat, register it
            console.log(chatId)
            if (!chatId) {
                dispatch(createChat({ chatId: chat._id, title: responseTitle }))
                dispatch(setCurrentChat(chat._id))
            }


            dispatch(addMessages({ chatId: resolvedChatId, content: message, role: "user" }))

            dispatch(addMessages({ chatId: resolvedChatId, content: AIMessage.content, role: "ai" }))

            dispatch(setLoading(false))
            return response
        }
        catch (error) {
            dispatch(setError(error.message))
            dispatch(setLoading(false))
            throw error
        }
    }

    const handleGetAllChats = async () => {
        try {
            const res = await getallchats();
            if (res.chats) {
                const chatsObj = {};
                res.chats.forEach(c => {
                    chatsObj[c._id] = { id: c._id, title: c.title, messages: [] };
                });
                dispatch(setChats(chatsObj));
            }
        } catch (err) {
            console.error("Failed to load chats:", err);
        }
    }

    const handleGetMessages = async (chatId) => {
        try {
            const res = await getallmessages(chatId);
            if (res.messages) {
                res.messages.forEach(msg => {
                    dispatch(addMessages({ chatId, content: msg.content, role: msg.role }))
                })
            }
        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    }

    return {
        initializeSocket,
        handleSendMessage,
        handleGetAllChats,
        handleGetMessages
    }
}
