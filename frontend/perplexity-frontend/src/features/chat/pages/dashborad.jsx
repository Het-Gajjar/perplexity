import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../../Auth/hook/useAuth'
import { useChat } from '../hooks/useChat'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { getallchats, getallmessages } from '../services/chat.api'
import { setChats, setCurrentChat, addMessages } from '../chat.slice'
import '../styles/Dashboard.css'

const dashborad = () => {

    const { user } = useAuth()
    const { chats, currentChat } = useSelector(state => state.chat)
    const chatHook = useChat();
    const dispatch = useDispatch();

    useEffect(() => {
        chatHook.initializeSocket()
        // Load initial chats
        getallchats().then(res => {
            const chatsObj = {};
            if (res.chats) {
                res.chats.forEach(c => {
                    chatsObj[c._id] = { id: c._id, title: c.title, messages: [] };
                });
            }
            dispatch(setChats(chatsObj));
        }).catch(err => console.error("Failed to load chats:", err));
    }, [])

    // Load messages when currentChat changes
    useEffect(() => {
        if (currentChat && chats[currentChat]?.messages.length === 0) {
            getallmessages(currentChat).then(res => {
                if (res.messages) {
                    res.messages.forEach(msg => {
                        dispatch(addMessages({ chatId: currentChat, content: msg.content, role: msg.role }))
                    })
                }
            }).catch(console.error)
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