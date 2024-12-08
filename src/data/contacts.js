// Import utility function
import getRandomSentence from "utils/getRandomSentence";

// Placeholder Profile API URL
const placeholderProfileApi = "https://ui-avatars.com/api/";

// Helper function to generate profile names
function generateProfileName(user) {
  if (user.name && user.name.length >= 2) {
    return user.name.substring(0, 2).toUpperCase(); // Use first two letters of the name
  }
  if (user.phone_number && user.phone_number.startsWith("+91")) {
    return user.phone_number.substring(3, 5); // Use two digits after "+91"
  }
  return "NN"; // Default placeholder if neither condition is met
}

// Helper function to generate profile picture URL
function generateProfilePictureUrl(user) {
  const profileName = generateProfileName(user);
  return `${placeholderProfileApi}?name=${profileName}&background=random&size=128`;
}

// Function to fetch data from the API
async function fetchUsersMessages() {
  const apiUrl = "https://four-difficult-fuchsia.glitch.me/users-messages";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Assuming the API returns data in a flat array
    return data.data.map((user) => ({
      ...user,
      profile_picture: generateProfilePictureUrl(user),
      profile_name: generateProfileName(user),
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array or handle as needed
  }
}

// Function to periodically fetch and update users
async function startPollingForUpdates(users) {
  const pollingInterval = 3000; // 3 seconds

  setInterval(async () => {
    try {
      console.log("Checking for updates...");

      const fetchedUsers = await fetchUsersMessages();

      fetchedUsers.forEach((fetchedUser) => {
        const existingUserIndex = users.findIndex(
          (user) => user.id === fetchedUser.id
        );

        if (existingUserIndex !== -1) {
          // Update existing user
          users[existingUserIndex] = {
            ...users[existingUserIndex],
            ...fetchedUser,
          };
        } else {
          // Add new user
          users.push(fetchedUser);
        }
      });

      console.log("Users updated:", users);
    } catch (error) {
      console.error("Error during polling:", error);
    }
  }, pollingInterval);
}

// Fetch users on initialization
const users = [];
fetchUsersMessages().then((fetchedUsers) => {
  users.push(...fetchedUsers);
  startPollingForUpdates(users);
});

// Export users as the default export
export default users;
