import {Composer} from "telegraf";
import {sendErrorMessage} from "../helpers/errorAndTokensExpired.js";
import {subscribeMessage} from "../messages/subscribe.js";
import {User} from "../models/User.js";
import 'dotenv/config'
import {Subscribers} from "../models/Subscribers.js";

const composer = new Composer()


composer.action('sub 1', async (ctx) => {
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

composer.action('sub 2', async (ctx) => {
  const invoice = {
    provider_token: process.env.PAYMENTS_KEY, // Replace with your provider token
    start_parameter: 'invoice1234',
    title: 'Безлим GPT 3.5 + GPT 4',
    description: 'Безлим GPT 3.5 + GPT 4 - 550₽/месяц',
    currency: 'RUB',
    prices: [
      { label: 'Product 2', amount: 55000 }, // Amount is in cents
    ],
    payload: 'custom_payload',
  };

  ctx.replyWithInvoice(invoice);
  ctx.type = 2;
})

composer.action('sub 3', async (ctx) => {
  const invoice = {
    provider_token: process.env.PAYMENTS_KEY, // Replace with your provider token
    start_parameter: 'invoice12345',
    title: 'Midjourney + DALL-E 3',
    description: 'Midjourney + DALL-E 3 - 1250₽/месяц (лимит 100 запросов)',
    currency: 'RUB',
    prices: [
      { label: 'Product 3', amount: 125000 }, // Amount is in cents
    ],
    payload: 'custom_payload',
  };

  ctx.replyWithInvoice(invoice);
  ctx.type = 3;
})

composer.action('sub 4', async (ctx) => {
  const invoice = {
    provider_token: process.env.PAYMENTS_KEY, // Replace with your provider token
    start_parameter: 'invoice12367',
    title: 'GPT 3.5 + GPT 4 + Midjourney + DALL-E 3 ',
    description: 'GPT 3.5 + GPT 4 + Midjourney + DALL-E 3  - 2500₽/месяц (GPT безлимит, Midjourney + DALL-E 3 - 150 картинок)',
    currency: 'RUB',
    prices: [
      { label: 'Product 4', amount: 250000 }, // Amount is in cents
    ],
    payload: 'custom_payload',
  };

  ctx.replyWithInvoice(invoice);
  ctx.type = 4;
})

composer.on('pre_checkout_query', async (ctx) => {
  ctx.answerPreCheckoutQuery(true);

})

composer.on('successful_payment', async (ctx) => {
  const tgId = ctx.from.id;
  let currentTimeMillis = Date.now();
  let currentDate = new Date(currentTimeMillis);

  let year = currentDate.getFullYear();
  let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // добавляем ноль перед месяцем
  let day = ('0' + currentDate.getDate()).slice(-2); // добавляем ноль перед днем
  let hours = ('0' + currentDate.getHours()).slice(-2); // добавляем ноль перед часами
  let minutes = ('0' + currentDate.getMinutes()).slice(-2); // добавляем ноль перед минутами
  let seconds = ('0' + currentDate.getSeconds()).slice(-2); // добавляем ноль перед секундами

  let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  await Subscribers.update({type: ctx.type, start: formattedDate}, {
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