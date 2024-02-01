import {errorMessage, tokensExpiredMessage} from "../messages/global.js";
import {User} from "../models/User.js";
import {Subscribers} from "../models/Subscribers.js";

export async function sendErrorMessage(ctx) {
  // const user = await User.findOne({
  //   where: {
  //     tgId: tgId
  //   }
  // })
  // if(!user) {
  //   ctx
  //     .reply(
  //       errorMessage, {
  //         parse_mode: "html",
  //         reply_markup: {
  //           inline_keyboard: [
  //             [{
  //               text: "Купить подписку ⚡️",
  //               callback_data: "subscribe",
  //             },],
  //           ],
  //         },
  //       }
  //     )
  //   return false;
  // }
  // return true;
  ctx
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

}


export async function sendTokenExpiredMessage(ctx, tgId) {
  const subscriber = await Subscribers.findOne({
    where: {
      tgId: tgId
    }
  })
  if(subscriber.active === false) {
    ctx
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
    return false;
  }
  return true

}