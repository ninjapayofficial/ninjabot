// const express = require('express');
// const app = express();

// const TelegramBot = require('node-telegram-bot-api');

// const botToken = process.env.BOT_TOKEN;
// const bot = new TelegramBot(botToken, { polling: true });

// const verifiedUsers = new Set();
// const pendingVerification = new Map();

// const port = process.env.PORT || 3000;

// async function getGroupId() {
//   const result = await bot.getUpdates();
//   const chatId = result[0].message.chat.id;
//   return chatId;
// }

// bot.on('new_chat_members', (message) => {
//   const user = message.new_chat_member;
//   const chatId = message.chat.id;

//   if (verifiedUsers.has(user.id)) {
//     bot.sendMessage(chatId, `Welcome back, ${user.first_name}!`);
//   } else {
//     const num1 = Math.floor(Math.random() * 10) + 1;
//     const num2 = Math.floor(Math.random() * 10) + 1;
//     const answer = num1 + num2;

//     bot.sendMessage(chatId, `Welcome to the group, ${user.first_name}! To verify that you are human, please solve this math problem: ${num1} + ${num2} = ?`);
//     pendingVerification.set(user.id, { chatId, answer });

//     bot.restrictChatMember(chatId, user.id, {
//       can_send_messages: false
//     });
//   }
// });

// bot.on('message', (response) => {
//   const userAnswer = parseInt(response.text);
//   const user = response.from;
//   const verification = pendingVerification.get(user.id);

//   if (verification && userAnswer === verification.answer) {
//     const chatId = verification.chatId;
//     bot.sendMessage(chatId, 'Thank you, you are verified!');
//     verifiedUsers.add(user.id);
//     bot.restrictChatMember(chatId, user.id, {
//       can_send_messages: true
//     });

//     pendingVerification.delete(user.id);
//   } else if (verification) {
//     bot.sendMessage(verification.chatId, 'Sorry, your answer is incorrect. Please try again.');
//   }
// });

// getGroupId().then((chatId) => {
//   bot.getChatMembersCount(chatId).then((count) => {
//     const allMembers = [...Array(count)].map((_, i) => i + 1);

//     allMembers.forEach((userId) => {
//       bot.restrictChatMember(chatId, userId, {
//         can_send_messages: false
//       });
//     });
//   });
// });

// bot.on('left_chat_member', (message) => {
//   const userId = message.left_chat_member.id;
//   verifiedUsers.delete(userId);
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// bot.on('polling_error', (error) => {
//   console.log(error);
// });
