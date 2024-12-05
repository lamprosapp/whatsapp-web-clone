import React from "react";
import Icon from "components/Icon";
import { Link } from "react-router-dom";
import formatTime from "utils/formatTime";
import { useUsersContext } from "context/usersContext";
import PropTypes from "prop-types"; // Optional: For type checking

const Contact = ({ contact }) => {
  const { setUserAsUnread } = useUsersContext();

  const getLastMessage = () => {
    // Ensure contact.messages is defined and is an object
    if (!contact.messages || typeof contact.messages !== "object") {
      console.warn(`Invalid messages structure for contact ID: ${contact.id}`);
      return null;
    }

    const messageDates = Object.keys(contact.messages);

    if (messageDates.length === 0) {
      console.warn(`No messages found for contact ID: ${contact.id}`);
      return null;
    }

    // Assuming the dates are in a format where the last key is the most recent
    // If not, you might need to sort the dates appropriately
    const recentMessageDate = messageDates[messageDates.length - 1];
    const messagesArray = contact.messages[recentMessageDate];

    // Check if messagesArray is an array
    if (!Array.isArray(messagesArray)) {
      console.warn(
        `Expected messagesArray to be an array for contact ID: ${contact.id}, date: ${recentMessageDate}, but got:`,
        messagesArray
      );
      return null;
    }

    // If the array is empty, return null
    if (messagesArray.length === 0) {
      console.warn(`No messages for contact ID: ${contact.id} on date: ${recentMessageDate}`);
      return null;
    }

    // Clone the array to prevent mutating the original data
    const messages = [...messagesArray];
    const lastMessage = messages.pop();
    return lastMessage;
  };

  const lastMessage = getLastMessage();

  return (
    <Link
      className="sidebar-contact"
      to={`/chat/${contact.id}`}
      onClick={() => setUserAsUnread(contact.id)}
    >
      <div className="sidebar-contact__avatar-wrapper">
        <img
          src={contact.profile_picture}
          alt={contact.name} // Changed alt to contact.name for better accessibility
          className="avatar"
        />
      </div>
      <div className="sidebar-contact__content">
        <div className="sidebar-contact__top-content">
          <h2 className="sidebar-contact__name">{contact.name}</h2>
          <span className="sidebar-contact__time">
            {lastMessage ? formatTime(lastMessage.time) : ""}
          </span>
        </div>
        <div className="sidebar-contact__bottom-content">
          <p className="sidebar-contact__message-wrapper">
            {lastMessage && lastMessage.status && (
              <Icon
                id={lastMessage.status === "sent" ? "singleTick" : "doubleTick"}
                aria-label={lastMessage.status}
                className={`sidebar-contact__message-icon ${
                  lastMessage.status === "read" ? "sidebar-contact__message-icon--blue" : ""
                }`}
              />
            )}
            <span
              className={`sidebar-contact__message ${
                contact.unread ? "sidebar-contact__message--unread" : ""
              }`}
            >
              {contact.typing ? <i>typing...</i> : lastMessage ? lastMessage.content : ""}
            </span>
          </p>
          <div className="sidebar-contact__icons">
            {contact.pinned && <Icon id="pinned" className="sidebar-contact__icon" />}
            {contact.unread > 0 && (
              <span className="sidebar-contact__unread">{contact.unread}</span>
            )}
            <button aria-label="sidebar-contact__btn">
              <Icon
                id="downArrow"
                className="sidebar-contact__icon sidebar-contact__icon--dropdown"
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Optional: Define PropTypes for better type checking
Contact.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    profile_picture: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    whatsapp_name: PropTypes.string.isRequired,
    unread: PropTypes.number.isRequired,
    messages: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          content: PropTypes.string,
          sender: PropTypes.number,
          time: PropTypes.string,
          status: PropTypes.string,
          image: PropTypes.bool,
        })
      )
    ).isRequired,
    group: PropTypes.bool.isRequired,
    pinned: PropTypes.bool.isRequired,
    typing: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Contact;
