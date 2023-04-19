// const express = require('express');
// const app = express();

// // Import the 'node-telegram-bot-api' module
// const TelegramBot = require('node-telegram-bot-api');

// // Create a new instance of the TelegramBot with your Bot Token
// const bot = new TelegramBot('6248027615:AAFGqxA_SPOTcyKv18SMQ9e_ERYfEHe4SQs', { polling: true });

// // Keep track of verified users
// const verifiedUsers = [];

// // Configure the port that the server listens on
// const port = process.env.PORT || 3000;

// // Listen for new users joining the group
// bot.on('new_chat_members', (message) => {
//   const user = message.new_chat_member;
//   const chatId = message.chat.id;

//   // Check if the user is already verified
//   if (verifiedUsers.includes(user.id)) {
//     bot.sendMessage(chatId, `Welcome back, ${user.first_name}!`);
//   } else {
//     // Send a welcome message and verification step to the new user
//     bot.sendMessage(chatId, `Welcome to the group, ${user.first_name}! To verify that you are human, please solve this math problem: 5 + 3 = ?`)
//       .then(() => {
//         // Listen for the user's response
//         bot.on('message', (response) => {
//           const answer = parseInt(response.text);

//           // Check if the user's answer is correct
//           if (answer === 8) {
//             bot.sendMessage(chatId, 'Thank you, you are verified!');
//             verifiedUsers.push(user.id);
//           } else {
//             bot.sendMessage(chatId, 'Sorry, your answer is incorrect. Please try again.');
//           }

//           // Remove the listener to prevent multiple verifications
//           bot.removeListeners('message');

//           // Block the user from sending messages if they are not verified
//           if (!verifiedUsers.includes(user.id)) {
//             bot.restrictChatMember(chatId, user.id, {
//               can_send_messages: false
//             });
//           }
//         });
//       });
//   }
// });

// // Log the server start message
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // Log any errors
// bot.on('polling_error', (error) => {
//   console.log(error);
// });
