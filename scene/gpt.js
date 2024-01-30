import {WizardScene} from "telegraf/scenes";
import {dialogStoped, freeRequestsExpired, sendMessageMessage, sendSubcriberMessageMessage} from "../messages/gpt.js";
import openai from "../config/openai.js";
import pool from './../config/mysql.js'
import {gptStory} from "../actions/gpt.js";
import {sendTokenExpiredMessage} from "../helpers/errorAndTokensExpired.js";
import {Subscribers} from "../models/Subscribers.js";
import {User} from "../models/User.js";
import {sequelize} from "../config/sequelize.js";

const keyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {text: 'Закончить диалог', callback_data: 'gpt stop'},
      ],
    ],
  },
};

export const gptScene = new WizardScene(
  'gptScene', async (ctx) => {
    try {
      const tgId = ctx.from.id;
      const subscriber = await Subscribers.findOne({
        where: {
          tgId: tgId
        }
      })
      if(subscriber.active === false && ctx.session.gptModel === 'gpt-4-0125-preview') {
        await ctx.reply('Вы не можете использовать модель GPT-4 без подписки.', {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {text: 'Назад ⬅️', callback_data: 'gpt back'},
                {text: 'Купить подписку 💸', callback_data: 'subscription buy'}
              ],
            ],
          },
        })
        await ctx.scene.leave()
      } else if(subscriber.active === false) {
        const user = await User.findOne({
          where: {
            tgId: tgId
          }
        })
        if(user.freeRequests >= 4) {
          await ctx.reply(freeRequestsExpired, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {text: 'Назад ⬅️', callback_data: 'gpt back'},
                  {text: 'Купить подписку 💸', callback_data: 'subscription buy'}
                ],
              ],
            },
          })
          await ctx.scene.leave()
        }
      } else {
        if(subscriber.active === true) {
          ctx.reply(sendSubcriberMessageMessage, {
            parse_mode: "html",
          })
        } else {
          ctx.reply(sendMessageMessage, {
            parse_mode: "html",
          })
        }

        return ctx.wizard.next()
      }



    } catch {}
  },
  async (ctx) => {
    try {
      const tgId = ctx.from.id
      const message = ctx.message.text;
      const subscriber = await Subscribers.findOne({
        where: {
          tgId: tgId
        }
      })
      if(subscriber.active === false) {
        const user = await User.findOne({
          where: {
            tgId: tgId
          }
        })
        if(user.freeRequests >= 4) {
          ctx.reply(freeRequestsExpired, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {text: 'Назад ⬅️', callback_data: 'gpt back'},
                  {text: 'Купить подписку 💸', callback_data: 'subscription buy'}
                ],
              ],
            },
          })
          await ctx.scene.leave()
        }
      }else if(subscriber.active === false && ctx.session.gptModel === 'gpt-4-0125-preview') {
        await ctx.reply('Вы не можете использовать модель GPT-4 без подписки.', {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {text: 'Назад ⬅️', callback_data: 'gpt back'},
                {text: 'Купить подписку 💸', callback_data: 'subscription buy'}
              ],
            ],
          },
        })
        await ctx.scene.leave()
      }
      const {message_id} = await ctx.reply('Ваш ответ генерируется...')
      const chatCompletion = await openai.chat.completions.create({
        messages: [{role: 'user', content: setSuitableMessageContent(ctx, message)}],
        model: ctx.session.gptModel,
      }).then(async res => {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          message_id,
          0,
          res.choices[0].message.content,
          keyboard
        );
        // const user = await User.findOne(
        //   {
        //     where: {
        //       tgId: tgId
        //     }
        //   }
        // );
        // console.log(user.gptMessages)
        const existingMessages = await User.findOne({
          attributes: ['gptMessages'],
          where: { tgId: tgId },
        });

        const currentMessages = JSON.parse(existingMessages.gptMessages);
        currentMessages.push(message);

        await User.update(
          { gptMessages: JSON.stringify(currentMessages) },
          { where: { tgId: tgId } }
        );
      })


    } catch (e) {
      console.log(e)
      await ctx.reply('Неудалось сгенерировать ответ.', {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {text: 'Назад ⬅️', callback_data: 'gpt back'},
            {text: 'Купить подписку 💸', callback_data: 'subscription buy'}
          ],
        ],
      },
    })}
  }
)


function setSuitableMessageContent(ctx, message) {
  if (ctx.session.actionType === 'gpt request') {
    return message;
  } else if (ctx.session.actionType === 'gpt post') {
    return `напиши пост - ${message}`
  } else if (ctx.session.actionType === 'gpt plan') {
    return `напиши план - ${message}`
  } else if (ctx.session.actionType === 'gpt story') {
    return `напиши историю - ${message}`
  }
}

const gptStop = async(ctx) => {
  await ctx.reply(dialogStoped, {
    parse_mode: 'HTML'
  })
  await ctx.scene.leave()
}


gptScene.action('gpt stop', (ctx) => gptStop(ctx))