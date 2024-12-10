import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Users Context
const UsersContext = createContext();

const useUsersContext = () => useContext(UsersContext);

const UsersProvider = ({ children }) => {
  const [usersState, setUsersState] = useState([]);

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
      const payload = { to: phone_number, message, media };

      const response = await axios.post(
        "https://four-difficult-fuchsia.glitch.me/send",
        payload
      );

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

  useEffect(() => {
    startPollingForUpdates(setUsersState);
  }, []);

  return (
    <UsersContext.Provider value={{ users: usersState, setUserAsUnread, addNewMessage }}>
      {children}
    </UsersContext.Provider>
  );
};

export { useUsersContext, UsersProvider };

// Function to fetch users
async function fetchUsersMessages() {
  const apiUrl = "https://four-difficult-fuchsia.glitch.me/users-messages";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.map((user) => ({
      ...user,
      profile_picture: generateProfilePictureUrl(user),
      profile_name: generateProfileName(user),
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Function to start polling
async function startPollingForUpdates(setUsersState) {
  const pollingInterval = 3000; // 3 seconds

  setInterval(async () => {
    try {
      const fetchedUsers = await fetchUsersMessages();
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
    } catch (error) {
      console.error("Error during polling:", error);
    }
  }, pollingInterval);
}

// Helper functions
function generateProfileName(user) {
  if (user.name && user.name.length >= 2) {
    return user.name.substring(0, 2).toUpperCase();
  }
  if (user.phone_number && user.phone_number.startsWith("+91")) {
    return user.phone_number.substring(3, 5);
  }
  return "NN";
}

function generateProfilePictureUrl(user) {
  const profileName = generateProfileName(user);
  return `https://ui-avatars.com/api/?name=${profileName}&background=random&size=128`;
}
