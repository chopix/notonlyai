import {Composer} from "telegraf";
import isSub from "../helpers/isSub.js";
import {sendErrorMessage} from "../helpers/errorAndTokensExpired.js";
import pool from '../config/mysql.js'
import frame from "../helpers/frame.js";
import moment from 'moment'
import {User} from "../models/User.js";
import {Subscribers} from "../models/Subscribers.js";

const composer = new Composer()


composer.command('profile', async (ctx) => {
  await isSub(ctx)
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
  let gptMessagesCount = JSON.parse(user.gptMessages).length;
  let dalleMessagesCount = JSON.parse(user.dalleMessages).length;
  let lost =
    "до " +
    moment(moment(subscriber.start))
      .add(subscriber.period, "d")
      .format("DD-MM-YYYY hh:mm");
  let reg_date = moment(subscriber.createdAt).format("DD-MM-YYYY hh:mm");
  return ctx
          .reply(
              `<b>Твой профиль 💼</b>\n\n${user.isAdmin === true ? '<i><b>Роль  — </b> Админ 💪</i>' : ''}\n\n\nПодписка — <b>${subscriber.active === false ? 'Неактивна' : 'Активна'}</b> ⚡️\n${subscriber.active === true ? `Действует до — ${lost}⏳` : ''}<b></b>\n\n<b>Лимиты:</b>\n/circle — нет лимитов 🔹\n/draw — нет лимитов 🔹\n/upscale — нет лимитов 🔹\n/erase — нет лимитов 🔹\n/revise — нет лимитов 🔹\n/gpt — ${subscriber.active === false ? `${4 - Number(user.freeRequests)} ${frame.sklonenie(4 - Number(user.freeRequests), ["токен", "токена", "токенов"])} в GPT-3.5` : 'нет лимитов'} ${(subscriber.active === false && user.freeRequests === 4) ? "❌" : "🔹"} \n\n\<b>Кол-во запросов в GPT за все время  — ${gptMessagesCount}\nКол-во запросов в DALL-E за все время  — ${dalleMessagesCount}</b> \n\n<i>Регистрация — ${reg_date}</i>`, {
                  parse_mode: "html",
                  reply_markup: {
                      inline_keyboard: [
                          [{
                              text: "Продлить подписку ⚡️",
                              callback_data: "subscribe",
                          }, ],
                      ],
                  },
                  disable_web_page_preview: true,
              }
          )
})

// composer.command('profile', async (ctx) => {
//     await isSub(ctx)
//     const chatId = ctx.from.id;
//     pool.query(
//         "SELECT * FROM users WHERE `tg_id`=?", [chatId.toString()],
//         function(err, result) {
//             if (err) {
//                 return console.log(err);
//             }
//
//             if (!result.length) {
//                 return sendErrorMessage(ctx)
//
//                     .catch((e) => {
//                         console.log(e);
//                     });
//             }
//
//             if (result[0].state !== "stable") {
//                 return;
//             }
//
//             pool.query(
//                 "SELECT * FROM subscribes WHERE `tg_id`=?", [chatId.toString()],
//                 function(err, result_sub) {
//                     if (err) {
//                         return console.log(err);
//                     }
//
//                     let reg_date = moment(result[0].date).format("DD-MM-YYYY hh:mm");
//
//                     if (result_sub[0].active == 1) {
//                         let lost =
//                             "до " +
//                             moment(moment(result_sub[0].start))
//                                 .add(result_sub[0].period, "d")
//                                 .format("DD-MM-YYYY hh:mm");
//
//                         if (result_sub[0].period >= 9999) {
//                             lost = "безлимит";
//                         }
//                         // 🚫💠🔹
//                         return ctx
//                             .reply(
//                                 "<b>Твой профиль 💼</b>\n\nПодписка — <b>активна</b> ⚡️\nДействие — <b>" +
//                                 lost +
//                                 " ⏳</b>\n\n<b>Лимиты:</b>\n/circle — нет лимитов 🔹\n/draw — нет лимитов 🔹\n/upscale — нет лимитов 🔹\n/erase — нет лимитов 🔹\n/revise — нет лимитов 🔹\n/gpt — нет лимитов 🔹\n\n<i>Регистрация — " +
//                                 reg_date +
//                                 "</i>", {
//                                     parse_mode: "html",
//                                     reply_markup: {
//                                         inline_keyboard: [
//                                             [{
//                                                 text: "Продлить подписку ⚡️",
//                                                 callback_data: "subscribe",
//                                             }, ],
//                                         ],
//                                     },
//                                     disable_web_page_preview: true,
//                                 }
//                             )
//                             .catch((err) => {
//                                 console.log(err);
//                             });
//                     }
//
//                     let limits = JSON.parse(result[0].limits);
//
//                     let sticker_1 = "🚫";
//                     let sticker_2 = "🚫";
//                     let sticker_3 = "🚫";
//                     let sticker_4 = "🚫";
//                     let sticker_5 = "🚫";
//                     let sticker_6 = "🚫";
//
//                     if (limits.draw > 0) {
//                         sticker_1 = "🔹";
//                     }
//                     if (limits.upscale > 0) {
//                         sticker_2 = "🔹";
//                     }
//                     if (limits.erase > 0) {
//                         sticker_3 = "🔹";
//                     }
//                     if (limits.revise > 0) {
//                         sticker_4 = "🔹";
//                     }
//                     if (limits.gpt > 0) {
//                         sticker_5 = "🔹";
//                     }
//                     if (limits.circle > 0) {
//                         sticker_6 = "🔹";
//                     }
//
//                     return ctx
//                         .reply("<b>Твой профиль 💼</b>\n\nПодписка — <b>не активна</b>❌\n\n<b>Лимиты:</b>\n/circle — " +
//                             limits.circle +
//                             " " +
//                             frame.sklonenie(limits.circle, [
//                                 "токен",
//                                 "токена",
//                                 "токенов",
//                             ]) +
//                             " " +
//                             sticker_6 +
//                             "\n/draw — " +
//                             limits.draw +
//                             " " +
//                             frame.sklonenie(limits.draw, ["токен", "токена", "токенов"]) +
//                             " " +
//                             sticker_1 +
//                             "\n/upscale — " +
//                             limits.upscale +
//                             " " +
//                             frame.sklonenie(limits.upscale, [
//                                 "токен",
//                                 "токена",
//                                 "токенов",
//                             ]) +
//                             " " +
//                             sticker_2 +
//                             "\n/erase — " +
//                             limits.erase +
//                             " " +
//                             frame.sklonenie(limits.erase, [
//                                 "токен",
//                                 "токена",
//                                 "токенов",
//                             ]) +
//                             " " +
//                             sticker_3 +
//                             "\n/revise — " +
//                             limits.revise +
//                             " " +
//                             frame.sklonenie(limits.revise, [
//                                 "токен",
//                                 "токена",
//                                 "токенов",
//                             ]) +
//                             " " +
//                             sticker_4 +
//                             "\n/gpt — " +
//                             limits.gpt +
//                             " " +
//                             frame.sklonenie(limits.gpt, ["токен", "токена", "токенов"]) +
//                             " " +
//                             sticker_5 +
//                             "\n\nТокены обновляются раз в 5 дней\n\n<i>Регистрация — " +
//                             reg_date +
//                             "</i>", {
//                                 parse_mode: "html",
//                                 reply_markup: {
//                                     inline_keyboard: [
//                                         [{
//                                             text: "Купить подписку ⚡️",
//                                             callback_data: "subscribe",
//                                         }, ],
//                                     ],
//                                 },
//                                 disable_web_page_preview: true,
//                             }
//                         )
//                         .catch((err) => {
//                             console.log(err);
//                         });
//                 }
//             );
//         }
//     );
// })


export default composer