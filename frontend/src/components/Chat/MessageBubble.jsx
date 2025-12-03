const MessageBubble = ({ message, isOwnMessage, senderName }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`message-bubble ${isOwnMessage ? 'own-message' : 'other-message'}`}>
            {!isOwnMessage && senderName && <div className="message-sender-name">{senderName}</div>}
            <div className="message-content">
                <p>{message.text}</p>
            </div>
            <div className="message-footer">
                <span className="message-time">{formatTime(message.createdAt)}</span>
                {isOwnMessage && message.seen && <span className="message-seen">✓✓</span>}
            </div>
        </div>
    );
};

export default MessageBubble;
