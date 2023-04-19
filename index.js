const express = require('express');
const app = express();

// Import the 'node-telegram-bot-api' module
const TelegramBot = require('node-telegram-bot-api');

// Replace YOUR_BOT_TOKEN with your actual bot token
const bot = new TelegramBot('6248027615:AAFGqxA_SPOTcyKv18SMQ9e_ERYfEHe4SQs', { polling: true });

// Keep track of verified users
const verifiedUsers = [];

// Configure the port that the server listens on
const port = process.env.PORT || 3000;

// Listen for new users joining the group
bot.on('new_chat_members', (message) => {
  const user = message.new_chat_member;
  const chatId = message.chat.id;

  // Check if the user is already verified
  if (verifiedUsers.includes(user.id)) {
    bot.sendMessage(chatId, `Welcome back, ${user.first_name}!`);
  } else {
    // Generate a random math problem
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;

    // Send a welcome message and verification step to the new user
    bot.sendMessage(chatId, `Welcome to the group, ${user.first_name}! To verify that you are human, please solve this math problem: ${num1} + ${num2} = ?`)
      .then(() => {
        // Listen for the user's response
        bot.on('message', (response) => {
          const userAnswer = parseInt(response.text);

          // Check if the user's answer is correct
          if (userAnswer === answer) {
            bot.sendMessage(chatId, 'Thank you, you are verified!');
            verifiedUsers.push(user.id);
            // Allow the user to send messages
            bot.restrictChatMember(chatId, user.id, {
              can_send_messages: true
            });
          } else {
            bot.sendMessage(chatId, 'Sorry, your answer is incorrect. Please try again.');
          }

          // Remove the listener to prevent multiple verifications
          bot.removeListeners('message');
        });
      });
      // Block the user from sending messages if they are not verified
      bot.restrictChatMember(chatId, user.id, {
        can_send_messages: false
      });
  }
});

// Restrict all existing users in the chat from sending messages until they are verified
bot.getChatMembersCount(process.env.GROUP_CHAT_ID).then((count) => {
  bot.getChat(process.env.GROUP_CHAT_ID).then((chat) => {
    const allMembers = [...Array(count)].map((_, i) => i + 1);
    const chatId = chat.id;

    allMembers.forEach((userId) => {
      bot.restrictChatMember(chatId, userId, {
        can_send_messages: false
      });
    });
  });
});

// Log the server start message
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Log any errors
bot.on('polling_error', (error) => {
  console.log(error);
});
