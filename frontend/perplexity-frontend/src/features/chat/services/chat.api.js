import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/api/chats",
    withCredentials: true,
})

export async function sendMessage(message, chatId) {
    try {
        const response = (await api.post('/message', { message, chatId }))
        return response.data
    } catch (error) {
        console.error("Send message error:", error)
        throw error
    }
}

export async function getallmessages(chatId) {
    try {
        const response = (await api.get(`/${chatId}`))
        return response.data
    } catch (error) {
        console.error("Get chats error:", error)
        throw error
    }

}
export async function getallchats() {
    try {
        const response = (await api.get('/'))
        return response.data
    } catch (error) {
        console.error("Get chats error:", error)
        throw error
    }

}
export async function deletechat(chatId) {
    try {
        const response = (await api.delete(`/delete/${chatId}`))
        return response.data
    } catch (error) {
        console.error("Delete chat error:", error)
        throw error
    }
}