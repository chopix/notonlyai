import {Composer} from "telegraf";
import pool from './../config/mysql.js'
import {describeImageMessage} from "../messages/draw.js";
import {errorMessage, tokensExpiredMessage} from '../messages/global.js'
import {sendErrorMessage, sendTokenExpiredMessage} from "../helpers/errorAndTokensExpired.js";
import {dalleStop} from "../actions/draw.js";
import {User} from "../models/User.js";
import {Subscribers} from "../models/Subscribers.js";

const composer = new Composer()

const LIMITS = {
  3: 100,
  4: 150,
}


composer.command('draw', async (ctx) => {
    const tgId = ctx.from.id;
    const user = await User.findOne({
      where: {
        tgId: tgId
      }
    })
    const subscriber = await Subscribers.findOne({
      where: {
        tgId: tgId
      }
    })

    if(user && subscriber) {
      if(user.dalleRequestsCount < LIMITS[subscriber.type] & subscriber.type == 3 || user.dalleRequestsCount < LIMITS[subscriber.type] & subscriber.type == 4) {
        await ctx.scene.enter('drawScene');
      } else {
        await ctx.reply(tokensExpiredMessage, {
          parse_mode: "html",
          reply_markup: {
            inline_keyboard: [
              [{
                text: "Купить подписку ⚡️",
                callback_data: "subscribe",
              },],
            ],
          },
        })
      }

    } else {
      await ctx
        .reply(tokensExpiredMessage, {
            parse_mode: "html",
            reply_markup: {
              inline_keyboard: [
                [{
                  text: "Купить подписку ⚡️",
                  callback_data: "subscribe",
                },],
              ],
            },
          }
        )
    }

})

export default composer;