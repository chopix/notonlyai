import {Composer} from "telegraf";
import {sendErrorMessage} from "../helpers/errorAndTokensExpired.js";
import frame from "../helpers/frame.js";
import moment from 'moment'
import {User} from "../models/User.js";
import {Subscribers} from "../models/Subscribers.js";

const composer = new Composer()


composer.command('profile', async (ctx) => {
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



export default composer