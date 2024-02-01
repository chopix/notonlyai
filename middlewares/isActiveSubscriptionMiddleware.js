import {Subscribers} from "../models/Subscribers.js";
import {sendErrorMessage, sendTokenExpiredMessage} from "../helpers/errorAndTokensExpired.js";
import moment from "moment";
import {tokensExpiredMessage} from "../messages/global.js";

export default async function (ctx, next) {
  const tgId = ctx.from.id;
  console.log(tgId)
  const subscriber = await Subscribers.findOne({
    where: {
      tgId: tgId
    }
  })
  if(!subscriber) return sendErrorMessage(ctx, tgId)
  if(subscriber.active == true) {
    const currentDate = moment();
    const start = moment(subscriber.start);
    const startDataWithMonth = start.add(1, 'months')
    const isBefore = currentDate.isBefore(startDataWithMonth)
    if(isBefore === false) {
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
  }
}