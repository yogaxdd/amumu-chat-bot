import './TypingIndicator.css';

const TypingIndicator = ({ botAvatar }) => {
    return (
        <div className="typing-wrapper">
            <div className="typing-avatar">
                <img src={botAvatar || "/amumu-avatar.png"} alt="Bot" />
            </div>
            <div className="typing-bubble">
                <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
