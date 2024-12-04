import ppGirl1 from "assets/images/profile-picture-girl-1.jpeg";
import ppGirl2 from "assets/images/profile-picture-girl-2.jpeg";
import ppGirl3 from "assets/images/profile-picture-girl-3.jpeg";
import ppGirl4 from "assets/images/profile-picture-girl-4.jpeg";
import ppBoy1 from "assets/images/profile-picture-boy-1.jpeg";
import ppBoy2 from "assets/images/profile-picture-boy-2.jpeg";
import ppBoy3 from "assets/images/profile-picture-boy-3.jpeg";
import getRandomSentence from "utils/getRandomSentence";

// Function to fetch data from the API and process it
async function fetchUsersMessages() {
	const apiUrl = 'https://four-difficult-fuchsia.glitch.me/users-messages';
  
	try {
	  // Fetch data from the API
	  const response = await fetch(apiUrl);
  
	  // Check if the response is successful
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
  
	  // Parse the response as JSON
	  const data = await response.json();
  
	  // Process the data as needed
	  console.log(data.data);
  
	  // Example: Accessing the first user's name
	  if (data.length > 0) {
		console.log(`First user's name: ${data[0].name}`);
	  }
	  return data;
	} catch (error) {
	  // Handle errors
	  console.error('Error fetching data:', error);
	}
  }
  
  // Call the function to fetch and process the data


  

const users =   fetchUsersMessages();
export default users;
