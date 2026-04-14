import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import '../styles/Dashboard.css';
import { useChat } from '../hooks/useChat';

// Perplexity-style animated thinking loader
const ThinkingLoader = () => (
    <div className="message ai thinking-message">
        <div className="thinking-loader">
            <span className="thinking-dot"></span>
            <span className="thinking-dot"></span>
            <span className="thinking-dot"></span>
        </div>
    </div>
);

const ChatArea = ({ messages = [] }) => {
    const [inputValue, setInputValue] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const chat = useChat();
    const messagesEndRef = useRef(null);
    const currentChat = useSelector(state => state.chat.currentChat);
    const loading = useSelector(state => state.chat.loading);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSend = () => {
        if (inputValue.trim() && !loading) {
            chat.handleSendMessage(inputValue, currentChat, imageFile);
            setInputValue('');
            handleRemoveImage();
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
                            {msg.role === 'user' ? (
                                <div className="user-message-content">
                                    {/* Show attached image above text */}
                                    {msg.imageUrl && (
                                        <img
                                            src={msg.imageUrl}
                                            alt="Attached"
                                            className="message-image"
                                        />
                                    )}
                                    {msg.content}
                                </div>
                            ) : (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)' }}>
                        Start a new conversation!
                    </div>
                )}

                {loading && <ThinkingLoader />}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
                {/* Image preview above input box */}
                {imagePreview && (
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview-thumb" />
                        <button className="remove-image-btn" onClick={handleRemoveImage}>✕</button>
                    </div>
                )}

                <div className={`input-box ${loading ? 'input-box--disabled' : ''}`}>
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />

                    {/* Styled attach button */}
                    <button
                        className="attach-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        title="Attach image"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <input
                        type="text"
                        className="chat-input"
                        placeholder={loading ? 'Waiting for response...' : 'Ask anything...'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />

                    <button className="send-btn" onClick={handleSend} disabled={loading}>
                        {loading ? (
                            <span className="send-spinner"></span>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ChatArea;

