const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_TOKEN';
const bot = new TelegramBot(TOKEN);

const pendingPayments = new Map();

router.post('/webhook', async (req, res) => {
  try {
    console.log('Received payment webhook:', req.body);
    const paymentHash = req.body.payment_hash;

    if (!paymentHash) {
      res.status(400).send('Missing payment hash');
      return;
    }

    const paymentInfo = pendingPayments.get(paymentHash);

    if (!paymentInfo) {
      res.status(404).send('Payment not found');
      return;
    }

    const { chatId, userId } = paymentInfo;
    console.log(`Processing payment for chat ${chatId} and user ${userId}`);
    await bot.restrictChatMember(chatId, userId, {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_polls: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
      can_change_info: false,
      can_invite_users: false,
      can_pin_messages: false,
    });

    pendingPayments.delete(paymentHash);
    console.log('Payment processed successfully');
    res.status(200).send('Payment processed successfully');
  } catch (error) {
    console.error('Error processing payment webhook:', error);
    res.status(500).send('Error processing payment webhook');
  }
});

function addPendingPayment(paymentHash, chatId, userId) {
  pendingPayments.set(paymentHash, { chatId, userId });
}

module.exports = {
  router,
  addPendingPayment,
};
