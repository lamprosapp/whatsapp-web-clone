import React, { useEffect, useRef, useState } from "react";
import EmojiTray from "./components/EmojiTray";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import ChatSidebar from "./components/ChatSidebar";
import Search from "./components/Search";
import Profile from "./components/Profile";
import Convo from "./components/Convo";
import { useUsersContext } from "context/usersContext";

const Chat = ({ match, history }) => {
  const { users, setUserAsUnread, addNewMessage } = useUsersContext();
  const userId = match.params.id;
  const user = users.find((user) => user.id === userId);

  const lastMsgRef = useRef(null);
  const hasMarkedAsUnread = useRef(false);
  const [newMessage, setNewMessage] = useState("");

  const scrollToLastMsg = () => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!user) {
      history.push("/");
      return;
    }
    if (!hasMarkedAsUnread.current) {
      setUserAsUnread(user.id);
      hasMarkedAsUnread.current = true;
    }
    scrollToLastMsg();
  }, [user, history, setUserAsUnread]);

  const submitNewMessage = () => {
    if (newMessage.trim()) {
      addNewMessage(user.id, user.phone_number, newMessage);
      setNewMessage("");
      scrollToLastMsg();
    }
  };

  if (!user) return null;

  return (
    <div className="chat">
      <Header user={user} />
      <div className="chat__content">
        <Convo lastMsgRef={lastMsgRef} messages={user?.messages || {}} />
      </div>
      <footer>
        <EmojiTray newMessage={newMessage} setNewMessage={setNewMessage} />
        <ChatInput newMessage={newMessage} setNewMessage={setNewMessage} submitNewMessage={submitNewMessage} />
      </footer>
    </div>
  );
};

export default Chat;
