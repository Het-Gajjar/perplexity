import React, { useEffect, useState } from 'react'
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
    
    // Mobile sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            
            <div className="chat-area-wrapper">
                {/* Mobile Header */}
                <div className="mobile-header">
                    <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <span className="mobile-brand">QueryNova</span>
                </div>
                
                <ChatArea messages={activeMessages} currentChat={currentChat} />
            </div>
        </div>
    )
}

export default dashborad