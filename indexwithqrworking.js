// const express = require('express');
// const app = express();
// const axios = require('axios');
// const QRCode = require('qrcode');
// const TelegramBot = require('node-telegram-bot-api');

// const TOKEN = process.env.TELEGRAM_TOKEN;
// const API_KEY = process.env.API_KEY;
// const API_BASE_URL = process.env.API_BASE_URL;

// const bot = new TelegramBot(TOKEN, { polling: true });

// app.use(express.json());

// const payments = {};

// bot.on('new_chat_members', async (msg) => {
//   try {
//     await bot.restrictChatMember(msg.chat.id, msg.new_chat_member.id, {
//       can_send_messages: false,
//       can_send_media_messages: false,
//       can_send_polls: false,
//       can_send_other_messages: false,
//       can_add_web_page_previews: false,
//       can_change_info: false,
//       can_invite_users: false,
//       can_pin_messages: false,
//     });

//     const username = msg.new_chat_member.username || msg.new_chat_member.first_name;

//     const invoiceResponse = await axios.post(
//       `${API_BASE_URL}/api/v1/payments`,
//       {
//         out: false,
//         amount: 100,
//         memo: `Ninjapay Telegram group access for @${username}`,
//       },
//       {
//         headers: {
//           'X-Api-Key': API_KEY,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const paymentRequest = invoiceResponse.data.payment_request;
//     const paymentHash = invoiceResponse.data.payment_hash;

//     payments[paymentHash] = {
//       chatId: msg.chat.id,
//       memberId: msg.new_chat_member.id,
//       paymentRequest: paymentRequest,
//       paid: false,
//     };

//     await bot.sendMessage(msg.chat.id, `Hello @${username}! Please pay the 100 SAT ⚡invoice⚡ to get access to the chat:`);

//     // const qrCodeImage = await QRCode.toDataURL(paymentRequest);

//     // const sentInvoiceMessage = await bot.sendPhoto(msg.chat.id, qrCodeImage, {
//     //   caption: `Invoice: \n${paymentRequest}`,
//     //   reply_markup: {
//     //     inline_keyboard: [
//     //       [{
//     //         text: "I've paid!",
//     //         callback_data: paymentHash,
//     //       }]
//     //     ],
//     //   },
//     // });

//       // ... rest of the code

//           const qrCodeImage = await QRCode.toDataURL(paymentRequest);

//           // Create a buffer from the base64 string
//           const qrCodeBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');

//           const sentInvoiceMessage = await bot.sendPhoto(msg.chat.id, {
//            source: qrCodeBuffer,
//            filename: 'invoice_qr_code.png',
//            contentType: 'image/png',
//           }, {
//             caption: `Invoice: \n${paymentRequest}`,
//             reply_markup: {
//             inline_keyboard: [
//            [{
//             text: "I've paid!",
//             callback_data: paymentHash,
//           }]
//         ],
//       },
//     });

// // ... rest of the code



//   } catch (error) {
//     console.error('Error handling new chat member:', error);
//   }
// });

// bot.on('callback_query', async (query) => {
//   try {
//     const paymentHash = query.data;
//     const payment = payments[paymentHash];
    
//     if (payment && !payment.paid && query.from.id === payment.memberId) {
//       const paymentStatusResponse = await axios.get(`${API_BASE_URL}/api/v1/payments/${paymentHash}`, {
//         headers: {
//           'X-Api-Key': API_KEY,
//           'Content-type': 'application/json'
//         }
//       });
      
//       const paid = paymentStatusResponse.data.paid;
      
//       if (paid && !payment.paid) {
//         // Grant chat access
//         await bot.restrictChatMember(payment.chatId, payment.memberId, {
//           can_send_messages: true,
//           can_send_media_messages: true,
//           can_send_polls: true,
//           can_send_other_messages: true,
//           can_add_web_page_previews: true,
//           can_change_info: true,
//           can_invite_users: true,
//           can_pin_messages: true,
//         });
        
//         await bot.sendMessage(payment.chatId, `Payment received. Welcome to the group!`);
//         payment.paid = true;

//                 // Delete the invoice message and the callback query message
//         await bot.deleteMessage(payment.chatId, sentInvoiceMessage.message_id);
//         await bot.deleteMessage(payment.chatId, query.message.message_id);
//       }
//     }
//   } catch (error) {
//     console.error(`Error handling callback query for ${paymentHash}:`, error);
//   }
// });

// // Configure the port
// const port = process.env.PORT || 3000

// // Start the server.
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
