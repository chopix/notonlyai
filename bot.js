import {session, Telegraf} from "telegraf";
import 'dotenv/config'
import start from "./commands/start.js";
import restart from "./commands/restart.js";
import circle from './commands/circle.js'
import gpt from './commands/gpt.js'
import {Stage} from "telegraf/scenes";
import {gptScene} from "./scene/gpt.js";
import {sequelize} from "./config/sequelize.js";
import cron from 'node-cron'
import updateFreeRequests from "./helpers/updateFreeRequests.js";
import sendMessagesToAllUsers from "./helpers/sendMessagesToAllUsers.js";
import draw from "./commands/draw.js";
import {drawScene} from "./scene/draw.js";
import profile from "./commands/profile.js";

const bot = new Telegraf(process.env.TOKEN)

const stage = new Stage([gptScene, drawScene])
bot.use(session())
bot.use(stage.middleware());


sequelize.sync();

cron.schedule('0 0 * * *', async () => {
  await updateFreeRequests();
  await sendMessagesToAllUsers(bot)
});

bot.use(start, restart, circle, gpt, draw, profile)

bot.launch()

