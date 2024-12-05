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

	const userId = match.params.id; // `id` from the URL (string)
	let user = users.find((user) => user.id === userId); // Compare as strings

	const lastMsgRef = useRef(null);
	const [showAttach, setShowAttach] = useState(false);
	const [showEmojis, setShowEmojis] = useState(false);
	const [showProfileSidebar, setShowProfileSidebar] = useState(false);
	const [showSearchSidebar, setShowSearchSidebar] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [initialScrollDone, setInitialScrollDone] = useState(false); // Track if initial scroll is done

	useEffect(() => {
		// Redirect if user not found
		if (!user) {
			history.push("/");
		} else if (!initialScrollDone) {
			scrollToLastMsg();
			setUserAsUnread(user.id); // Mark the user as unread
			setInitialScrollDone(true); // Mark initial scroll as done
		}
	}, [user, history, setUserAsUnread, initialScrollDone]);

	// Manual scrolling is not affected by re-renders
	useEffect(() => {
		// Perform any operations when `users` changes
	}, [users]);

	const openSidebar = (cb) => {
		// Close any open sidebar first
		setShowProfileSidebar(false);
		setShowSearchSidebar(false);

		// Call the callback function to open the new sidebar
		cb(true);
	};

	const scrollToLastMsg = () => {
		// Ensure `lastMsgRef` exists before scrolling
		if (lastMsgRef.current) {
			lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const submitNewMessage = () => {
		// Add a new message for the user and reset the input
		addNewMessage(user.id, newMessage);
		setNewMessage("");
		setTimeout(scrollToLastMsg, 100); // Scroll after DOM update
	};

	return (
		<div className="chat">
			<div className="chat__body">
				<div className="chat__bg"></div>

				<Header
					user={user}
					openProfileSidebar={() => openSidebar(setShowProfileSidebar)}
					openSearchSidebar={() => openSidebar(setShowSearchSidebar)}
				/>
				<div className="chat__content">
					{/* Pass reversed messages to Convo */}
					<Convo lastMsgRef={lastMsgRef} messages={Object.values(user?.messages || {}).flat().reverse()} />
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
