import { createContext, useContext, useState } from "react";
import users from "../data/contacts";
import axios from "axios";

// Create Users Context
const UsersContext = createContext();

const useUsersContext = () => useContext(UsersContext);

const UsersProvider = ({ children }) => {
  const [usersState, setUsersState] = useState(users);

  const _updateUserProp = (userId, prop, value) => {
    setUsersState((prevUsers) => {
      const updatedUsers = [...prevUsers];
      const userIndex = updatedUsers.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        const user = updatedUsers[userIndex];
        updatedUsers[userIndex] = { ...user, [prop]: value };
      }

      return updatedUsers;
    });
  };

  const setUserAsUnread = (userId) => {
    _updateUserProp(userId, "unread", 0);
  };

  const addNewMessage = async (userId, phone_number, message, media = null) => {
    setUsersState((prevUsers) => {
      const updatedUsers = [...prevUsers];
      const userIndex = updatedUsers.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        const newMessage = {
          content: message,
          sender: null,
          time: new Date().toLocaleTimeString(),
          status: "pending",
          media: media ? true : false,
        };

        updatedUsers[userIndex].messages.TODAY.push(newMessage);
      }

      return updatedUsers;
    });

    try {
      const payload = {
        to: phone_number,
        message,
        media,
      };

      const response = await axios.post("https://four-difficult-fuchsia.glitch.me/send", payload);

      setUsersState((prevUsers) => {
        const updatedUsers = [...prevUsers];
        const userIndex = updatedUsers.findIndex((user) => user.id === userId);

        if (userIndex !== -1) {
          const userMessages = updatedUsers[userIndex].messages.TODAY;
          const lastMessage = userMessages[userMessages.length - 1];
          if (lastMessage && lastMessage.content === message) {
            lastMessage.status = "delivered";
          }
        }

        return updatedUsers;
      });
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      setUsersState((prevUsers) => {
        const updatedUsers = [...prevUsers];
        const userIndex = updatedUsers.findIndex((user) => user.id === userId);

        if (userIndex !== -1) {
          const userMessages = updatedUsers[userIndex].messages.TODAY;
          const lastMessage = userMessages[userMessages.length - 1];
          if (lastMessage && lastMessage.content === message) {
            lastMessage.status = "failed";
          }
        }

        return updatedUsers;
      });
    }
  };

  const updateUsers = (fetchedUsers) => {
    setUsersState((prevUsers) => {
      const updatedUsers = [...prevUsers];

      fetchedUsers.forEach((fetchedUser) => {
        const existingUserIndex = updatedUsers.findIndex((user) => user.id === fetchedUser.id);

        if (existingUserIndex !== -1) {
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            ...fetchedUser,
          };
        } else {
          updatedUsers.push(fetchedUser);
        }
      });

      return updatedUsers;
    });
  };

  return (
    <UsersContext.Provider value={{ users: usersState, setUserAsUnread, addNewMessage, updateUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export { useUsersContext, UsersProvider };
