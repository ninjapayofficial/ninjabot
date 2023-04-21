const express = require('express');
const app = express();
const axios = require('axios');
const QRCode = require('qrcode');
const webhook = require('./webhook');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TELEGRAM_TOKEN || '6248027615:AAFGqxA_SPOTcyKv18SMQ9e_ERYfEHe4SQs';
const bot = new TelegramBot(TOKEN, { polling: true });

app.use(express.json());
app.use(webhook.router);

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
        webhook: 'https://evening-escarpment-94174.herokuapp.com/webhook',
      },
      {
        headers: {
          'X-Api-Key': 'c6bda6e5c9374c21a5cdee58572f08e1',
          'Content-Type': 'application/json',
        },
      }
    );

    const qrCode = await QRCode.toDataURL(invoiceResponse.data.payment_request);

    webhook.addPendingPayment(invoiceResponse.data.payment_hash, msg.chat.id, msg.new_chat_member.id);

    await bot.sendPhoto(msg.chat.id, qrCode, {
      caption: 'Please pay the 100 SAT invoice to get access to the chat',
    });
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
