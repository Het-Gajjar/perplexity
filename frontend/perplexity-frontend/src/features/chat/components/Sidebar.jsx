import React from 'react';
import '../styles/Dashboard.css';

const Sidebar = ({ chats = [], onSelectChat, currentChat, isOpen, onClose }) => {
    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} 
                onClick={onClose}
            ></div>
            
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-brand">QueryNova</span>
                    <button className="sidebar-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="chat-list">
                    <button 
                        className="chat-item-btn new-chat" 
                        onClick={() => {
                            onSelectChat(null);
                            onClose();
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Chat
                    </button>
                    {chats.length > 0 ? (
                        chats.map((chat) => (
                            <button 
                                key={chat.id} 
                                className={`chat-item-btn ${currentChat === chat.id ? 'current' : ''}`}
                                onClick={() => {
                                    onSelectChat(chat.id);
                                    onClose();
                                }}
                            >
                                {chat.title || "New Chat"}
                            </button>
                        ))
                    ) : (
                        <div style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No chats yet...</div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
