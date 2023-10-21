const { program } = require("commander");
const TelegramBot = require("node-telegram-bot-api");

const token = 'PUT_YOUR_TOKEN_HERE' // <--!-!-!-!-!-!-!-!-!-!-

const bot = new TelegramBot(token, { polling: false });

let chatId = 0; // REPLACE BY ID OF YOUR CHAT 

program
  .command("send-message <message>")
  .description("Send message by Telegram Bot")
  .action((message) => {
    bot.sendMessage(chatId, message);
  });

program
  .command("send-photo <path>")
  .description(
    "Send photo to Telegram Bot. Just drag and drop it console after flag"
  )
  .action((path) => {
    bot.sendPhoto(chatId, path);
  });

program.parse(process.argv);
