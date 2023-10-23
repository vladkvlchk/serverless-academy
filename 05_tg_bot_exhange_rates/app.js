const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const NodeCache = require("node-cache");

const WEATHER_API_KEY = "*_*"; // PUT WEATHER API KEY HERE
const TOKEN = "0_0"; // PUT TG-BOT TOKEN HERE
const CHAT_ID = 0.0; // PUT YOUR CHAT ID HERE

const bot = new TelegramBot(TOKEN, { polling: true });
const ratesCache = new NodeCache();

//buttons
const menu_options = {
  reply_markup: {
    keyboard: [[{ text: "/weather" }], [{ text: "/exchange rates" }]],
  },
};

const weather_options = {
  reply_markup: {
    keyboard: [
      [{ text: "every 3 hours" }, { text: "every 6 hours" }],
      [{ text: "< back" }],
    ],
  },
};

const rates_options = {
  reply_markup: {
    keyboard: [[{ text: "USD" }, { text: "EUR" }], [{ text: "< back" }]],
  },
};

//senders
const sendForecast = async (fr_mode) => {
  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=London&appid=${WEATHER_API_KEY}&units=metric`);

    const forecastList = data.list.slice(0, fr_mode * 2);

    let text = "______ London 🇬🇧 _______\n";

    for (let i = 0; i < forecastList.length; i += Math.round(fr_mode / 3)) {
      text += `\nTime: ${new Date(forecastList[i].dt * 1000).toLocaleString()}
  Description: ${forecastList[i].weather[0].description}
  🌡️Temp: ${Math.round(forecastList[i].main.temp)}°C (feels like ${Math.round(
        forecastList[i].main.feels_like
      )}°C)
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

const sendExchangeRate = async (currency) => {
  try {
    if (!ratesCache.get(currency)) {
      //getting API data
      const { data } = await axios.get("https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11");
      const p24_USD = data.find((obj) => obj.ccy === "USD");
      const p24_EUR = data.find((obj) => obj.ccy === "EUR");

      const res = await axios.get("https://api.monobank.ua/bank/currency");
      const mono_USD = res.data.find((obj) => obj.currencyCodeA === 840); //840 - USD code
      const mono_EUR = res.data.find((obj) => obj.currencyCodeA === 978); //978 - EUR code

      ratesCache.set("USD", { p24: p24_USD, mono: mono_USD }, 600 * 5); // data cached for 5 min
      ratesCache.set("EUR", { p24: p24_EUR, mono: mono_EUR }, 600 * 5); // data cached for 5 min
    }

    const cachedRates = ratesCache.get(currency);

    const text = `---- ${currency}/UAH ----
PrivateBank:  ${Math.round(cachedRates.p24.buy * 100) / 100} / ${Math.round(cachedRates.p24.sale * 100) / 100}
monobank:     ${Math.round(cachedRates.mono.rateBuy * 100) / 100} / ${Math.round(cachedRates.mono.rateSell * 100) / 100}`;
    
    return bot.sendMessage(CHAT_ID, text, rates_options);
  } catch (e) {
    console.error(e);
  }
};

//commands
const main = () => {
  bot.on("message", (msg) => {
    if (msg.text === "/start" || msg.text === "< back") {
      return bot.sendMessage(CHAT_ID, "Choose a folder", menu_options);
    }
    //folders
    if (msg.text === "/weather") {
      return bot.sendMessage(
        CHAT_ID,
        "What interval you need weather forecast for?",
        weather_options
      );
    }
    if (msg.text === "/exchange rates") {
      return bot.sendMessage(
        CHAT_ID,
        "What currency you wanna know?",
        rates_options
      );
    }

    // /weather
    if (msg.text === "every 3 hours") {
      return sendForecast(3);
    }
    if (msg.text === "every 6 hours") {
      return sendForecast(6);
    }

    // /exchanges rates
    if (msg.text === "USD") {
      sendExchangeRate("USD");
    }
    if (msg.text === "EUR") {
      sendExchangeRate("EUR");
    }
  });
};

main();
