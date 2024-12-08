import React, { useEffect, useRef, useState } from "react";
import "./styles/main.css";
import EmojiTray from "./components/EmojiTray";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import ChatSidebar from "./components/ChatSidebar";
import Icon from "components/Icon";
import Search from "./components/Search";
import Profile from "./components/Profile";
import Convo from "./components/Convo";
import { useUsersContext } from "context/usersContext";

const Chat = ({ match, history }) => {
	const { users, setUserAsUnread, addNewMessage } = useUsersContext();
  
	const userId = match.params.id;
	const user = users.find((user) => user.id === userId);
  
	const lastMsgRef = useRef(null);
	const [showAttach, setShowAttach] = useState(false);
	const [showEmojis, setShowEmojis] = useState(false);
	const [showProfileSidebar, setShowProfileSidebar] = useState(false);
	const [showSearchSidebar, setShowSearchSidebar] = useState(false);
	const [newMessage, setNewMessage] = useState("");
  
	useEffect(() => {
	  if (!user) {
		history.push("/");
		return;
	  }
	  scrollToLastMsg();
	  setUserAsUnread(user.id);
	}, [user, history, setUserAsUnread]);
  
	useEffect(() => {
	  if (user) scrollToLastMsg();
	}, [users]);
  
	const openSidebar = (cb, currentState) => {
	  setShowProfileSidebar(false);
	  setShowSearchSidebar(false);
	  cb(!currentState);
	};
  
	const scrollToLastMsg = () => {
	  if (lastMsgRef.current) {
		lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
	  }
	};
  
	const submitNewMessage = () => {
	  if (newMessage.trim()) {
		addNewMessage(user.id, newMessage);
		setNewMessage("");
		scrollToLastMsg();
	  }
	};
  
	if (!user) return null;
  
	return (
	  <div className="chat">
		<div className="chat__body">
		  <div className="chat__bg"></div>
		  <Header
			user={user}
			openProfileSidebar={() => openSidebar(setShowProfileSidebar, showProfileSidebar)}
			openSearchSidebar={() => openSidebar(setShowSearchSidebar, showSearchSidebar)}
		  />
		  <div className="chat__content">
			<Convo lastMsgRef={lastMsgRef} messages={user?.messages || {}} />
		  </div>
		  <footer className="chat__footer">
			<button
			  className="chat__scroll-btn"
			  aria-label="scroll down"
			  onClick={scrollToLastMsg}
			>
			  <Icon id="downArrow" />
			</button>
			<EmojiTray
			  showEmojis={showEmojis}
			  newMessage={newMessage}
			  setNewMessage={setNewMessage}
			/>
			<ChatInput
			  showEmojis={showEmojis}
			  setShowEmojis={setShowEmojis}
			  showAttach={showAttach}
			  setShowAttach={setShowAttach}
			  newMessage={newMessage}
			  setNewMessage={setNewMessage}
			  submitNewMessage={submitNewMessage}
			/>
		  </footer>
		</div>
		<ChatSidebar
		  heading="Search Messages"
		  active={showSearchSidebar}
		  closeSidebar={() => setShowSearchSidebar(false)}
		>
		  <Search />
		</ChatSidebar>
		<ChatSidebar
		  heading="Contact Info"
		  active={showProfileSidebar}
		  closeSidebar={() => setShowProfileSidebar(false)}
		>
		  <Profile user={user} />
		</ChatSidebar>
	  </div>
	);
  };
  
  export default Chat;
  