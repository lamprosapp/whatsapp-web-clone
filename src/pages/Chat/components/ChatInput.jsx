import React from "react";
import Icon from "components/Icon";

const ChatInput = ({
  showEmojis,
  setShowEmojis,
  showAttach,
  setShowAttach,
  newMessage,
  setNewMessage,
  submitNewMessage,
}) => {
  const detectEnterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      console.log("Enter key pressed. Submitting message.");
      submitNewMessage();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log("Input change detected:", value); // Debugging input value
    setNewMessage(value);
  };

  return (
    <div className="chat__input-wrapper">
      <button
        aria-label="Emojis"
        onClick={() => {
          console.log("Toggling emojis:", !showEmojis);
          setShowEmojis((prev) => !prev);
        }}
      >
        <Icon
          id="smiley"
          className={`chat__input-icon ${
            showEmojis ? "chat__input-icon--highlight" : ""
          }`}
        />
      </button>
      <input
        type="text"
        className="chat__input"
        placeholder="Type a message"
        value={newMessage}
        onChange={handleInputChange}
        onKeyDown={detectEnterPress}
      />
      {newMessage ? (
        <button
          aria-label="Send message"
          onClick={() => {
            console.log("Send button clicked. Submitting message.");
            submitNewMessage();
          }}
        >
          <Icon id="send" className="chat__input-icon" />
        </button>
      ) : (
        <button aria-label="Record voice note">
          <Icon id="microphone" className="chat__input-icon" />
        </button>
      )}
    </div>
  );
};

export default ChatInput;
