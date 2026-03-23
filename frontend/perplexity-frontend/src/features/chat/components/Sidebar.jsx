import React from 'react';
import '../styles/Dashboard.css';

const Sidebar = ({ chats = [], onSelectChat, currentChat }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                perplexity
            </div>
            <div className="chat-list">
                <button className="chat-item-btn" onClick={() => onSelectChat(null)} style={{ borderStyle: 'dashed', marginBottom: '8px' }}>
                    + New Chat
                </button>
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <button 
                            key={chat.id} 
                            className={`chat-item-btn ${currentChat === chat.id ? 'current' : ''}`}
                            onClick={() => onSelectChat(chat.id)}
                        >
                            {chat.title || "New Chat"}
                        </button>
                    ))
                ) : (
                    <div style={{ padding: '10px', color: 'var(--text-secondary)' }}>No chats yet...</div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
