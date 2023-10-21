const { program } = require("commander");
const TelegramBot = require("node-telegram-bot-api");

const token = "6664131755:AAHBwGC-uq561AI2EuGUTzsAnnsLZTwbtwY";

const bot = new TelegramBot(token, { polling: false });

let chatId = 351276484; // put if of your chat here

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
