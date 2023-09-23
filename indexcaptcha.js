// const express = require('express');
// const app = express();
// const morgan = require('morgan');

// const TOKEN = process.env.TELEGRAM_TOKEN || '';

// app.use(morgan('combined'));

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// (async () => {
//   const { GroupCaptcha } = await import('telegram-captcha');

//   const captcha = new GroupCaptcha(TOKEN, { polling: true }, {
//     size: 6,
//     language: 'en',
//     time_for_enter: 3,
//   });

//   captcha.bot.on('new_chat_members', async (msg) => {
//     try {
//       await captcha.generateCaptcha(msg);
//     } catch (error) {
//       console.error('Error generating captcha:', error);
//     }
//   });

//   captcha.bot.on('callback_query', async (query) => {
//     try {
//       await captcha.clickKeyboard(query);
//     } catch (error) {
//       console.error('Error handling callback query:', error);
//     }
//   });

//   // Sample endpoint
//   app.get('/', (req, res) => {
//     res.send('Hello, World!');
//   });

//   // Configure the port
//   const port = process.env.PORT || 3000;

//   // Start the server
//   app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
// })();
