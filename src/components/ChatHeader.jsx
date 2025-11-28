import './ChatHeader.css';

const ChatHeader = ({ botName, botAvatar }) => {
  return (
    <header className="chat-header">
      <div className="header-content">
        <div className="character-info">
          <div className="avatar-container">
            <img
              src={botAvatar || "/amumu-avatar.png"}
              alt={botName}
              className="character-avatar"
            />
            <span className="online-indicator"></span>
          </div>
          <div className="character-details">
            <h1 className="character-name">{botName || "Amumu"}</h1>
            <p className="character-status">Online • Always here for you ✨</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
