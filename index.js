const express = require('express');
const app = express();
const axios = require('axios');
const QRCode = require('qrcode');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TELEGRAM_TOKEN;
const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;

const bot = new TelegramBot(TOKEN, { polling: true });

app.use(express.json());

const payments = {};

const handleError = (error, message) => {
  console.error(`${message}:`, error);
};

bot.on('new_chat_members', async (msg) => {
  try {
    const { chat, new_chat_member } = msg;
    const username = new_chat_member.username || new_chat_member.first_name;
    await bot.restrictChatMember(chat.id, new_chat_member.id, {
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_polls: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
      can_change_info: false,
      can_invite_users: false,
      can_pin_messages: false,
    });

    const { data } = await axios.post(
      `${API_BASE_URL}/api/v1/payments`,
      {
        out: false,
        amount: 100,
        memo: `Ninjapay Telegram group access for @${username}`,
      },
      {
        headers: {
          'X-Api-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const { payment_request, payment_hash } = data;

    const sentHelloMessage = await bot.sendMessage(chat.id, `Hello @${username}! Please pay the 100 SAT ⚡invoice⚡ to get access to the chat:`);

    const qrCodeImage = await QRCode.toDataURL(payment_request);
    const qrCodeBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');
    const sentInvoiceMessage = await bot.sendPhoto(chat.id, qrCodeBuffer, {
      caption: `${payment_request}`,
      reply_markup: {
        inline_keyboard: [
          [{
            text: "I've paid!",
            callback_data: payment_hash,
          }]
        ],
      },
    });

    payments[payment_hash] = {
      chatId: chat.id,
      memberId: new_chat_member.id,
      paymentRequest: payment_request,
      paid: false,
      sentInvoiceMessageId: sentInvoiceMessage.message_id,
      sentHelloMessageId: sentHelloMessage.message_id,
    };
  } catch (error) {
    handleError(error, 'Error handling new chat member');
  }
});

bot.on('callback_query', async (query) => {
  const { message, data: paymentHash } = query;
  const { chat } = message;
  try {
    const payment = payments[paymentHash];

    if (payment && !payment.paid && query.from.id === payment.memberId) {
      const { data: { paid } } = await axios.get(`${API_BASE_URL}/api/v1/payments/${paymentHash}`, {
        headers: {
          'X-Api-Key': API_KEY,
          'Content-type': 'application/json'
        }
      });

      if (paid && !payment.paid) {
        const username = query.from.username || query.from.first_name;
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

    await bot.sendMessage(payment.chatId, `Payment received. Welcome to the group, @${username}!`);

    await bot.deleteMessage(chat.id, payment.sentInvoiceMessageId);
    await bot.deleteMessage(chat.id, payment.sentHelloMessageId);
  }
}

  } catch (error) {
    console.error(`Error handling callback query for ${paymentHash}:`, error);
  }
});

// Configure the port
const port = process.env.PORT || 3000

// Start the server.
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


