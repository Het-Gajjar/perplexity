import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChat: null,
        loading: false,
        error: null
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        createChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = { id: chatId, title, messages: [] }
        },
        addMessages: (state, action) => {
            const { chatId, content, imageUrl = null, role } = action.payload
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ content, imageUrl, role })
            }
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { setChats, setCurrentChat, setLoading, setError, addMessages, createChat } = chatSlice.actions;
export default chatSlice.reducer;