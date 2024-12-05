// Import profile pictures
import ppGirl1 from "assets/images/profile-picture-girl-1.jpeg";
import ppGirl2 from "assets/images/profile-picture-girl-2.jpeg";
import ppGirl3 from "assets/images/profile-picture-girl-3.jpeg";
import ppGirl4 from "assets/images/profile-picture-girl-4.jpeg";
import ppBoy1 from "assets/images/profile-picture-boy-1.jpeg";
import ppBoy2 from "assets/images/profile-picture-boy-2.jpeg";
import ppBoy3 from "assets/images/profile-picture-boy-3.jpeg";

// Import utility function
import getRandomSentence from "utils/getRandomSentence";

// Define dummy users
const dummyUsers = [
  {
    id: 1,
    profile_picture: ppGirl3,
    name: "Love of my life ❤️💜",
    phone_number: "+2348123456789",
    whatsapp_name: "Beyonce",
    unread: 3,
    messages: {
      "04/06/2021": [
        {
			content: getRandomSentence(),
			sender: 8,
			time: "08:11:26",
			status: null,
		},
		{
			content: getRandomSentence(),
			sender: null,
			time: "08:15:45",
			status: "read",
		},
      ],
    },
    group: false,
    pinned: true,
    typing: false,
  },
];

const users = [...dummyUsers];

// Function to fetch data from the API
async function fetchUsersMessages() {
  const apiUrl = "https://four-difficult-fuchsia.glitch.me/users-messages";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Assuming the API returns data in the same structure as dummyUsers
    return data.data; // Adjust this based on your actual API response structure
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array or handle as needed
  }
}

// Helper function to deeply merge two objects with null handling
function deepMergeWithNullHandling(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) {
        target[key] = {};
      }
      deepMergeWithNullHandling(target[key], source[key]);
    } else {
      // Only overwrite if source value is not null
      if (source[key] !== null) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Function to merge fetched users with existing users
async function mergeFetchedUsers() {
  const fetchedUsers = await fetchUsersMessages();

  // Create a map for quick lookup of fetched users by ID
  const fetchedUsersMap = new Map();
  fetchedUsers.forEach((user) => {
    fetchedUsersMap.set(user.id, user);
  });

  // Merge fetched users into the existing users array
  fetchedUsers.forEach((fetchedUser) => {
    const existingUserIndex = users.findIndex((user) => user.id === fetchedUser.id);

    if (existingUserIndex !== -1) {
      // Perform deep merge with null handling
      deepMergeWithNullHandling(users[existingUserIndex], fetchedUser);
    } else {
      // If the user doesn't exist in dummy data, add them
      users.push(fetchedUser);
    }
  });
}

// Immediately invoke the merge operation
mergeFetchedUsers();


// Function to periodically fetch and update users
function startPollingForUpdates() {
  const pollingInterval = 3000; // 3 seconds

  setInterval(async () => {
    try {
      console.log("Checking for updates...");

      const fetchedUsers = await fetchUsersMessages();

      // Create a map for quick lookup of fetched users by ID
      const fetchedUsersMap = new Map();
      fetchedUsers.forEach((user) => {
        fetchedUsersMap.set(user.id, user);
      });

      // Merge fetched users into the existing users array
      fetchedUsers.forEach((fetchedUser) => {
        const existingUserIndex = users.findIndex((user) => user.id === fetchedUser.id);

        if (existingUserIndex !== -1) {
          // Perform deep merge with null handling
          deepMergeWithNullHandling(users[existingUserIndex], fetchedUser);
        } else {
          // If the user doesn't exist in dummy data, add them
          users.push(fetchedUser);
        }
      });

      console.log("Users updated:", users);
    } catch (error) {
      console.error("Error during polling:", error);
    }
  }, pollingInterval);
}

// Start the polling mechanism
startPollingForUpdates();


// Export users as the default export
export default users;
