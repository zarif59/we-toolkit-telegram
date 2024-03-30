import { getUsage, login } from "we-toolkit";
import TelegramBot from 'node-telegram-bot-api';

let authData = await login("WE_LOGIN_NUMBER", "WE_LOGIN_PASSWORD"); // => change WE_LOGIN_NUMBER WE_LOGIN_PASSWORD
let usage = await getUsage(authData);

// getting info from api server
const weInfo = () => {
    const keys = Object.keys(usage.detailedLineUsageList);
    const C_TED_Primary_Fixed_Data = keys[keys.length -1]; //Finding Primary Fixed Data Account, usually located at the last array of detailedLineUsageList.
    const info = `Name: ${usage.summarizedLineUsageList[0].englishDisplayName} \nTotal Amount: ${usage.summarizedLineUsageList[0].initialTotalAmount}GB \nBalance: ${usage.summarizedLineUsageList[0].freeAmount}GB \nUsed: ${usage.summarizedLineUsageList[0].usedAmount}GB \nUsage Percentage: ${usage.summarizedLineUsageList[0].usagePercentage}% \nRenewal Date: ${usage.detailedLineUsageList[C_TED_Primary_Fixed_Data].renewalDate}`;
    return info
}

// send it via telegram
const sendTelegram = () => {
    const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // => change YOUR_TELEGRAM_BOT_TOKEN 
    const bot = new TelegramBot(token, {polling: true});

    bot.sendMessage(CHAT_ID, weInfo()) // => change CHAT_ID 
    .then(() => {
        console.log('done sending');
        process.exit(0);
    })
    .catch((error) => {
        console.log(error.code);  // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
        process.exit(0);
    });
}

sendTelegram()