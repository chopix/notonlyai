import {Subscribers} from "../models/Subscribers.js";
import {sendErrorMessage, sendTokenExpiredMessage} from "../helpers/errorAndTokensExpired.js";
import moment from "moment";
import {errorMessage, tokensExpiredMessage} from "../messages/global.js";
import {User} from "../models/User.js";

export default async function (ctx, next) {
  const tgId = ctx.from.id;
  const subscriber = await Subscribers.findOne({
    where: {
      tgId: tgId
    }
  })
  if (!subscriber) return ctx
    .reply(
      errorMessage, {
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
  else if (subscriber.active == true) {
    console.log('active true')
    const currentDate = moment()
    const start = moment(subscriber.start);
    const startDataWithMonth = start.add(1, 'months')
    const isBefore = currentDate.isBefore(startDataWithMonth)
    if (isBefore === false) {
      console.log('isBefore false')
      await Subscribers.update({active: 0, type: 0, start: 0}, {
        where: {
          tgId: tgId
        }
      })
      return ctx
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
    } else return next();
  } else if (subscriber.active === false) {
    console.log('active false')
    const user = await User.findOne({
      where: {
        tgId: tgId
      }
    })
    if (user.freeRequests >= 4) {
      console.log('user free requests')
      return ctx
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
    } else return next();
  } else return next();
}