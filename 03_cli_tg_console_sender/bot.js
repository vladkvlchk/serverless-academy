/* ---------- APP FOR FINDING OUT ID OF YOUR CHAT --------------- */
const TelegramBot = require("node-telegram-bot-api");

const token = 'PUT_YOUR_TOKEN_HERE' // <--!-!-!-!-!-!-!-!-!-!-

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log("Your chat's id: ", chatId);
    bot.sendMessage(chatId, `ID of our chat: ${chatId}`);
  })

// 1) run 'node bot.js' in console;
// 2) go to Telegram and open your bot;
// 3) send '/start' to the bot
// 4) you can see id in console or in chat
