import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import '../styles/Dashboard.css';
import { useChat } from '../hooks/useChat';

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
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <main className="messages-container">
                <div className="messages-inner">
                    {messages.length > 0 ? (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'ai'}`}>
                                {msg.role === 'user' ? (
                                    <>
                                        {msg.imageUrl && (
                                            <img
                                                src={msg.imageUrl}
                                                alt="Attached"
                                                className="message-image"
                                            />
                                        )}
                                        {Array.isArray(msg.content) ? (
                                            msg.content.map((c, i) => (
                                                c.type === "text" ? <span key={i}>{c.text}</span> : null
                                            ))
                                        ) : (
                                            msg.content
                                        )}
                                    </>
                                ) : (
                                    <ReactMarkdown>
                                        {Array.isArray(msg.content) 
                                            ? msg.content.map(c => c.text).join("") 
                                            : msg.content}
                                    </ReactMarkdown>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '15vh', color: 'var(--text-secondary)' }}>
                            <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontWeight: '500' }}>Welcome to QueryNova</h2>
                            <p>How can I help you today?</p>
                        </div>
                    )}
                    {loading && <ThinkingLoader />}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <div className="input-container-wrapper">
                {imagePreview && (
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview-thumb" />
                        <button className="remove-image-btn" onClick={handleRemoveImage}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                )}

                <div className={`input-box ${loading ? 'input-box--disabled' : ''}`}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />

                    <button
                        className="attach-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        title="Attach image"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48"></path>
                        </svg>
                    </button>

                    <textarea
                        className="chat-input"
                        placeholder={loading ? 'Thinking...' : 'Ask QueryNova...'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        rows={1}
                        style={{ 
                            height: 'auto', 
                            minHeight: '24px', 
                            paddingTop: '0', 
                            paddingBottom: '0',
                            marginTop: '2px'
                        }}
                    />

                    <button className="send-btn" onClick={handleSend} disabled={loading || (!inputValue.trim() && !imageFile)}>
                        {loading ? (
                            <span className="send-spinner"></span>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-1px) translateY(1px)' }}>
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatArea;
