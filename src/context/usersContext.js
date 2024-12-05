import { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchUsersMessages = async () => {
      try {
        const response = await fetch("https://four-difficult-fuchsia.glitch.me/users-messages");
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        setUsersState((prevUsers) => {
          // Merge with existing users if needed
          const updatedUsers = [...prevUsers];
          data.forEach((fetchedUser) => {
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
      } catch (error) {
        console.error("Failed to fetch user messages:", error);
      }
    };

    fetchUsersMessages();
  }, []);

  return (
    <UsersContext.Provider value={{ users: usersState, setUserAsUnread, addNewMessage }}>
      {children}
    </UsersContext.Provider>
  );
};

export { useUsersContext, UsersProvider };
