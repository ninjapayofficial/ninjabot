// const express = require('express');
// const app = express();


// const TOKEN = process.env.TELEGRAM_TOKEN || '6248027615:AAFGqxA_SPOTcyKv18SMQ9e_ERYfEHe4SQs';

// // import { GroupCaptcha } from 'telegram-captcha';
// const { GroupCaptcha } = require('telegram-captcha');


// const captcha = new GroupCaptcha(TOKEN, {polling: true}, {
//     size: 6,
//     language: 'de',
//     time_for_enter: 3
// });

// captcha.bot.on("new_chat_members", (msg) => captcha.generateCaptcha(msg));
// captcha.bot.on("callback_query", (query) => captcha.clickKeyboard(query));

const express = require('express');
const app = express();

const TOKEN = process.env.TELEGRAM_TOKEN || '6248027615:AAFGqxA_SPOTcyKv18SMQ9e_ERYfEHe4SQs';

// Use dynamic import for 'telegram-captcha'
(async () => {
  const { GroupCaptcha } = await import('telegram-captcha');

  const captcha = new GroupCaptcha(TOKEN, { polling: true }, {
    size: 6,
    language: 'en',
    time_for_enter: 3,
  });

  captcha.bot.on('new_chat_members', (msg) => captcha.generateCaptcha(msg));
  captcha.bot.on('callback_query', (query) => captcha.clickKeyboard(query));

  // Sample endpoint
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  // Configure the port
  const port = process.env.PORT || 3000;

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
