import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../../Auth/hook/useAuth'
import { useChat } from '../hooks/useChat'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { setCurrentChat } from '../chat.slice'
import '../styles/Dashboard.css'

const dashborad = () => {

    const { user } = useAuth()
    const { chats, currentChat } = useSelector(state => state.chat)
    const chatHook = useChat();
    const dispatch = useDispatch();

    useEffect(() => {
        chatHook.initializeSocket()
        chatHook.handleGetAllChats()
    }, [])

    // Load messages when currentChat changes
    useEffect(() => {
        if (currentChat && chats[currentChat]?.messages.length === 0) {
            chatHook.handleGetMessages(currentChat)
        }
    }, [currentChat])

    const activeMessages = currentChat && chats[currentChat] ? chats[currentChat].messages : [];

    return (
        <div className="dashboard-container">
            <Sidebar
                chats={Object.values(chats)}
                currentChat={currentChat}
                onSelectChat={(id) => dispatch(setCurrentChat(id))}
            />
            <ChatArea messages={activeMessages} currentChat={currentChat} />
        </div>
    )
}



export default dashborad