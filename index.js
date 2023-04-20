const express = require('express');
const app = express();


const TOKEN = process.env.TELEGRAM_TOKEN || '6248027615:AAFGqxA_SPOTcyKv18SMQ9e_ERYfEHe4SQs';

import { GroupCaptcha } from 'telegram-captcha';

const captcha = new GroupCaptcha(TOKEN, {polling: true}, {
    size: 6,
    language: 'de',
    time_for_enter: 3
});

captcha.bot.on("new_chat_members", (msg) => captcha.generateCaptcha(msg));
captcha.bot.on("callback_query", (query) => captcha.clickKeyboard(query));