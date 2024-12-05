// services/userService.js

import ppGirl1 from "assets/images/profile-picture-girl-1.jpeg";
import ppGirl2 from "assets/images/profile-picture-girl-2.jpeg";
import ppGirl3 from "assets/images/profile-picture-girl-3.jpeg";
import ppGirl4 from "assets/images/profile-picture-girl-4.jpeg";
import ppBoy1 from "assets/images/profile-picture-boy-1.jpeg";
import ppBoy2 from "assets/images/profile-picture-boy-2.jpeg";
import ppBoy3 from "assets/images/profile-picture-boy-3.jpeg";
import getRandomSentence from "utils/getRandomSentence";

// Initial Dummy Data
let users = [
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
                    sender: 1,
                    time: "08:11:26",
                    status: null,
                },
                // ... other messages
            ],
            YESTERDAY: [
                // ... messages
            ],
            TODAY: [
                // ... messages
            ],
        },
        group: false,
        pinned: true,
        typing: false,
    },
    // ... other dummy users
];

// Function to fetch data from the API and merge with dummy data
export async function fetchAndMergeUsers() {
    const apiUrl = 'https://four-difficult-fuchsia.glitch.me/users-messages';
  
    try {
        const response = await fetch(apiUrl);
      
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
      
        const fetchedData = await response.json();
      
        if (fetchedData && fetchedData.data) {
            // Merge fetched data with dummy data
            fetchedData.data.forEach(fetchedUser => {
                const existingUserIndex = users.findIndex(user => user.id === fetchedUser.id);
                
                if (existingUserIndex !== -1) {
                    // Merge messages, handling nulls
                    users[existingUserIndex] = {
                        ...users[existingUserIndex],
                        ...fetchedUser,
                        messages: mergeMessages(users[existingUserIndex].messages, fetchedUser.messages),
                    };
                } else {
                    // Add new user from fetched data
                    users.push({
                        ...fetchedUser,
                        profile_picture: handleProfilePicture(fetchedUser.profile_picture),
                        messages: fetchedUser.messages || {},
                        unread: fetchedUser.unread || 0,
                        group: fetchedUser.group || false,
                        pinned: fetchedUser.pinned || false,
                        typing: fetchedUser.typing || false,
                    });
                }
            });
        }

        return users;
    } catch (error) {
        console.error('Error fetching data:', error);
        return users; // Return existing users even if fetch fails
    }
}

// Helper function to merge messages
function mergeMessages(dummyMessages, fetchedMessages) {
    const mergedMessages = { ...dummyMessages };

    Object.keys(fetchedMessages).forEach(dateKey => {
        if (mergedMessages[dateKey]) {
            mergedMessages[dateKey] = [
                ...mergedMessages[dateKey],
                ...fetchedMessages[dateKey].map(msg => ({
                    ...msg,
                    content: msg.content || "", // Handle null content
                    sender: msg.sender || null,
                    time: msg.time || "00:00:00",
                    status: msg.status || "sent",
                    image: msg.image || false,
                })),
            ];
        } else {
            mergedMessages[dateKey] = fetchedMessages[dateKey].map(msg => ({
                ...msg,
                content: msg.content || "",
                sender: msg.sender || null,
                time: msg.time || "00:00:00",
                status: msg.status || "sent",
                image: msg.image || false,
            }));
        }
    });

    return mergedMessages;
}

// Helper function to handle profile pictures (if URLs or different logic is needed)
function handleProfilePicture(picture) {
    // Implement logic if fetched data provides URLs or different identifiers
    return picture;
}

// Function to get current users (could be enhanced with state management)
export function getUsers() {
    return users;
}
