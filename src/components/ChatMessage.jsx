import './ChatMessage.css';

const ChatMessage = ({ message, isUser, timestamp, userAvatar, botAvatar }) => {
    // Function to format text with bold support
    const formatMessage = (text) => {
        if (!text) return text;

        // Split by **text** or *text* pattern
        const parts = text.split(/\*{1,2}(.*?)\*{1,2}/g);

        return parts.map((part, index) => {
            // Odd indices are the captured bold parts
            if (index % 2 === 1) {
                return <strong key={index}>{part}</strong>;
            }
            return part;
        });
    };

    return (
        <div className={`message-wrapper ${isUser ? 'user-message' : 'bot-message'}`}>
            {!isUser && (
                <div className="message-avatar">
                    <img src={botAvatar || "/amumu-avatar.png"} alt="Bot" />
                </div>
            )}
            <div className="message-content">
                <div className="message-bubble">
                    <p className="message-text">{formatMessage(message)}</p>
                </div>
                <span className="message-time">{timestamp}</span>
            </div>
            {isUser && (
                <div className="message-avatar">
                    <img src={userAvatar || "/user-avatar.png"} alt="You" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
