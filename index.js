const express = require('express');
const app = express();

// Import the 'node-telegram-bot-api' module
const TelegramBot = require('node-telegram-bot-api');

// Create a new instance of the TelegramBot with your Bot Token
const bot = new TelegramBot('6248027615:AAFGqxA_SPOTcyKv18SMQ9e_ERYfEHe4SQs', { polling: true });

// Keep track of verified users
const verifiedUsers = [];

// Configure the port that the server listens on
const port = process.env.PORT || 3000;

// Function to check if a user is verified
function isVerified(user) {
  return verifiedUsers.includes(user.id);
}

// Function to verify a user
function verifyUser(user, chatId) {
  bot.sendMessage(chatId, `Welcome to the group, ${user.first_name}! To verify that you are human, please solve this math problem: 5 + 3 = ?`)
    .then(() => {
      // Listen for the user's response
      bot.on('message', (response) => {
        const answer = parseInt(response.text);

        // Check if the user's answer is correct
        if (answer === 8) {
          bot.sendMessage(chatId, 'Thank you, you are verified!');
          verifiedUsers.push(user.id);
          bot.restrictChatMember(chatId, user.id, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: true,
            can_invite_users: true,
            can_pin_messages: true
          });
        } else {
          bot.sendMessage(chatId, 'Sorry, your answer is incorrect. Please try again.');
        }

        // Remove the listener to prevent multiple verifications
        bot.removeListeners('message');
      });
    });
}

// Listen for new users joining the group
bot.on('new_chat_members', (message) => {
  const user = message.new_chat_member;
  const chatId = message.chat.id;

  // Check if the user is already verified
  if (isVerified(user)) {
    bot.sendMessage(chatId, `Welcome back, ${user.first_name}!`);
  } else {
    verifyUser(user, chatId);
  }
});

// Listen for messages sent in the group
bot.on('message', (message) => {
  const user = message.from;
  const chatId = message.chat.id;

  // Block the user from sending messages if they are not verified
  if (!isVerified(user)) {
    bot.deleteMessage(chatId, message.message_id);
    bot.restrictChatMember(chatId, user.id, {
      can_send_messages: false
    });
    verifyUser(user, chatId);
  }
});

// Log the server start message
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Log any errors
bot.on('polling_error', (error) => {
  console.log(error);
});
