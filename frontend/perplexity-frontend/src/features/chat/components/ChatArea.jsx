import React, { useState, useRef, useEffect } from 'react';
import '../styles/Dashboard.css';
import { useChat } from '../hooks/useChat';

const ChatArea = ({ messages = [], currentChat }) => {
    const [inputValue, setInputValue] = useState('');
    const chat = useChat();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            chat.handleSendMessage(inputValue, currentChat);
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <main className="chat-area">
            <div className="messages-container">
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'ai'}`}>
                            {msg.content}
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)' }}>
                        Start a new conversation!
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
                <div className="input-box">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask anything..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="send-btn" onClick={handleSend}>
                        {/* SVG Send Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                        </svg>
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ChatArea;
