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
import subscribe from "./commands/subscribe.js";
import isSubMiddleware from "./middlewares/isSubMiddleware.js";
import isActiveSubscriptionMiddleware from "./middlewares/isActiveSubscriptionMiddleware.js";
import {Subscribers} from "./models/Subscribers.js";
import {User} from "./models/User.js";
import {circleScene} from "./scene/circle.js";

const bot = new Telegraf(process.env.TOKEN)

const stage = new Stage([gptScene, drawScene, circleScene])
bot.use(session())
bot.use(stage.middleware());
bot.use(isSubMiddleware());


bot.command('gpt', isActiveSubscriptionMiddleware, gpt)
bot.command('circle', isActiveSubscriptionMiddleware, circle)
bot.command('draw', isActiveSubscriptionMiddleware, draw)

bot.use(gpt, circle, draw);


bot.command('adminSubscribe', async (ctx) => {
  const tgId = ctx.from.id
  let currentTimeMillis = Date.now();
  let currentDate = new Date(currentTimeMillis);

  let year = currentDate.getFullYear();
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // добавляем ноль перед месяцем
  let day = ('0' + currentDate.getDate()).slice(-2); // добавляем ноль перед днем
  let hours = ('0' + currentDate.getHours()).slice(-2); // добавляем ноль перед часами
  let minutes = ('0' + currentDate.getMinutes()).slice(-2); // добавляем ноль перед минутами
  let seconds = ('0' + currentDate.getSeconds()).slice(-2); // добавляем ноль перед секундами

  let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  await Subscribers.update({type: 4, active: 1, start: formattedDate}, {where: {tgId: tgId}})
  ctx.reply('подписка выдана')
})


sequelize.sync();

cron.schedule('0 0 * * *', async () => {
  await updateFreeRequests();
  await sendMessagesToAllUsers(bot)
});

cron.schedule('0 0 1 * *', async () => {
  const users = await User.findAll();
  for (const user of users) {
    await user.update({ dalleRequestsCount: 0 });
  }
});

bot.use(start, restart, profile, subscribe)

bot.launch();


