import { createContext, useContext, useState } from "react";
import users from "../data/contacts";

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

  const addNewMessage = (userId, message) => {
    setUsersState((prevUsers) => {
      const updatedUsers = [...prevUsers];
      const userIndex = updatedUsers.findIndex((user) => user.id === userId);

      if (userIndex !== -1) {
        const newMessage = {
          content: message,
          sender: null,
          time: new Date().toLocaleTimeString(),
          status: "delivered",
        };

        updatedUsers[userIndex].messages.TODAY.push(newMessage);
      }

      return updatedUsers;
    });
  };

  return (
    <UsersContext.Provider value={{ users: usersState, setUserAsUnread, addNewMessage }}>
      {children}
    </UsersContext.Provider>
  );
};

export { useUsersContext, UsersProvider };
