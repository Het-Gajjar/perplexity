import { initializeSocket } from "../services/chat.socket"
import { sendMessage } from "../services/chat.api"
import { useDispatch, } from "react-redux"
import { setCurrentChat, setLoading, setError, addMessages, createChat } from "../chat.slice"

export const useChat = () => {

    const dispatch = useDispatch()


    const handleSendMessage = async (message, chatId) => {
        try {
            dispatch(setLoading(true))
            const response = await sendMessage(message, chatId);
            const { chat, AIMessage, title: responseTitle } = response;

            // If it's a new chat, register it
            if (!chatId) {
                dispatch(createChat({ chatId: chat._id, title: responseTitle }))
                dispatch(setCurrentChat(chat._id))
            }

            dispatch(addMessages({ chatId: chat._id, content: message, role: "user" }))
            dispatch(addMessages({ chatId: chat._id, content: AIMessage.content, role: "ai" }))

            dispatch(setLoading(false))
            return response
        }
        catch (error) {
            dispatch(setError(error.message))
            dispatch(setLoading(false))
            throw error
        }
    }
    return {
        initializeSocket,
        handleSendMessage
    }
}
