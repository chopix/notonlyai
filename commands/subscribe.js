import {Composer} from "telegraf";
import pool from '../config/mysql.js'
import {sendErrorMessage} from "../helpers/errorAndTokensExpired.js";
import {subscribeMessage} from "../messages/subscribe.js";
import {User} from "../models/User.js";
import 'dotenv/config'
import {Subscribers} from "../models/Subscribers.js";

const composer = new Composer()


composer.action('sub 1', async (ctx) => {
  console.log('213')
  const invoice = {
    provider_token: process.env.PAYMENTS_KEY, // Replace with your provider token
    start_parameter: 'invoice123',
    title: 'GPT 3.5',
    description: 'Безлимитное количество запросов GPT 3.5 - 350₽/месяц',
    currency: 'RUB',
    prices: [
      { label: 'Product 1', amount: 35000 }, // Amount is in cents
    ],
    payload: 'custom_payload',
  };

  ctx.replyWithInvoice(invoice);
  ctx.type = 1;
})

composer.on('successful_payment', async (ctx) => {
  const tgId = ctx.from.id;
  Subscribers.update({type: ctx.type, start: Date.now(), active: 1}, {
    where: {tgId: tgId}
  })
  ctx.reply('Оплата прошла успешно')
})



composer.command('subscribe', async (ctx) => {
  const chatId = ctx.from.id;
  const user = await User.findOne({
    where: {
      tgId: chatId
    }
  })
  if (!user) {
    return sendErrorMessage(ctx)
  }

  return ctx
    .reply(subscribeMessage, {
        parse_mode: "html",
        reply_markup: {
          inline_keyboard: [
            [{
              text: "Безлим. GPT 3.5 🌑",
              callback_data: "sub 1",
            }],
            [{
              text: "Безлим GPT 3.5 + GPT 4 🌒",
              callback_data: "sub 2",
            }],
            [{
              text: "Midjourney + DALL-E 3 🌓",
              callback_data: "sub 3",
            }],
            [{
              text: "GPT 3.5 + GPT 4 + Midjourney + DALL-E 3 🌔",
              callback_data: "sub 4",
            },
            ],
          ],
        },
        disable_web_page_preview: true,
      }
    )
    .catch((err) => {
      console.log(err);
    });
})

export default composer