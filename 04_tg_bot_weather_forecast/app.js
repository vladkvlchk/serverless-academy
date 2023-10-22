const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const API_KEY = "*_*"; //PUT YOUR API KEY HERE
const TOKEN = "0_0"; // PUT YOUR BOT TOKEN HERE
const CHAT_ID = 0.0; // PUT YOUR CHAT ID HERE

const bot = new TelegramBot(TOKEN, { polling: true });

const city_options = {
  reply_markup: {
    keyboard: [[{ text: "Forecast in London"}]],
  },
};

const frequency_options = {
  reply_markup: {
    keyboard: [
      [{ text: "at intervals of 3 hours" }],
      [{ text: "at intervals of 6 hours" }],
    ],
  },
};

const sendForecast = async (fr_mode) => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=London&appid=${API_KEY}&units=metric`
    );

    const forecastList = data.list.slice(0, fr_mode * 2);

    let text = '______ London 🇬🇧 _______\n'

    for(let i = 0; i < forecastList.length; i += Math.round(fr_mode / 3)) {
        text += `\nTime: ${new Date(forecastList[i].dt * 1000).toLocaleString()}
Description: ${forecastList[i].weather[0].description}
🌡️Temp: ${Math.round(forecastList[i].main.temp)}°C (feels like ${Math.round(forecastList[i].main.feels_like)}°C)
💨 Wind: ${forecastList[i].wind.speed} m/s
💧Humidity: ${forecastList[i].main.humidity} %
🪨 Pressure: ${forecastList[i].main.pressure} hPa
.........................`;
    }
  
    await bot.sendMessage(CHAT_ID, text); 
  } catch (e) {
    console.error(e);
  }
};

const start = () => {
  bot.on("message", (msg) => {
    if (msg.text === "/start") {
      return bot.sendMessage(
        CHAT_ID,
        "Hello! How can I help you?",
        city_options
      );
    }
    if (msg.text === "Forecast in London") {
      return bot.sendMessage(
        CHAT_ID,
        `How often do you want to get the info?`,
        frequency_options
      );
    }
    if (msg.text === "at intervals of 3 hours") {
      return sendForecast(3);
    }
    if (msg.text === "at intervals of 6 hours") {
      return sendForecast(6);
    }
  });
};

start();
