const express = require('express');
const app = express();
const axios = require('axios');
const QRCode = require('qrcode');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TELEGRAM_TOKEN || '6248027615:AAFGqxA_SPOTcyKv18SMQ9e_ERYfEHe4SQs';
const bot = new TelegramBot(TOKEN, { polling: true });

app.use(express.json());

const payments = {};

bot.on('new_chat_members', async (msg) => {
  try {
    await bot.restrictChatMember(msg.chat.id, msg.new_chat_member.id, {
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_polls: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
      can_change_info: false,
      can_invite_users: false,
      can_pin_messages: false,
    });

    const invoiceResponse = await axios.post(
      'https://legend.lnbits.com/api/v1/payments',
      {
        out: false,
        amount: 100,
        memo: 'Telegram group access',
      },
      {
        headers: {
          'X-Api-Key': 'c6bda6e5c9374c21a5cdee58572f08e1',
          'Content-Type': 'application/json',
        },
      }
    );

    const paymentRequest = invoiceResponse.data.payment_request;
    const paymentHash = invoiceResponse.data.payment_hash;

    payments[paymentHash] = {
      chatId: msg.chat.id,
      memberId: msg.new_chat_member.id,
      paymentRequest: paymentRequest,
      paid: false,
    };

    await bot.sendMessage(msg.chat.id, `Please pay the 100 SAT invoice to get access to the chat: \n${paymentRequest}`);

    // Start checking payment status periodically
    setInterval(async () => {
      try {
        const paymentStatusResponse = await axios.get(`https://legend.lnbits.com/api/v1/payments/${paymentHash}`, {
          headers: {
            'X-Api-Key': 'c6bda6e5c9374c21a5cdee58572f08e1',
            'Content-type': 'application/json'
          }
        });

        const paid = paymentStatusResponse.data.paid;
        const payment = payments[paymentHash];

        if (paid && !payment.paid) {
          // Grant chat access
          await bot.restrictChatMember(payment.chatId, payment.memberId, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: true,
            can_invite_users: true,
            can_pin_messages: true,
          });

          await bot.sendMessage(payment.chatId, `Payment received. Welcome to the group!`);
          payment.paid = true;
        }
      } catch (error) {
        console.error(`Error checking payment status for ${paymentHash}:`, error);
      }
    }, 10000); // Check every 10 seconds
  } catch (error) {
    console.error('Error handling new chat member:', error);
  }
});

// Configure the port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
