import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from './MessageBubble';

const ChatWindow = () => {
    const { activeConversation, messages, sendMessage } = useChat();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const currentUserId = user?._id;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const receiver = activeConversation.participants.find(p => p._id !== currentUserId);
        sendMessage(activeConversation._id, newMessage, receiver._id);
        setNewMessage('');
    };

    if (!activeConversation) {
        return (
            <div className="chat-window-empty">
                <div className="empty-state">
                    <h2>Welcome to Messaging</h2>
                    <p>Select a conversation to start chatting</p>
                </div>
            </div>
        );
    }

    const otherParticipant = activeConversation.participants.find(p => p._id !== currentUserId);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-header-info">
                    <div className="chat-avatar">
                        {otherParticipant?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3>{otherParticipant?.name}</h3>
                        <span className="user-status">{otherParticipant?.role}</span>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble
                            key={message._id}
                            message={message}
                            isOwnMessage={message.sender._id === currentUserId}
                            senderName={message.sender.name}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-container" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="chat-input"
                />
                <button type="submit" className="send-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
