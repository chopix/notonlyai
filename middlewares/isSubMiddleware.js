import {subscribeKeyboardMessage, subscribeLink, subscribeMessage} from "../messages/start.js";

export default function () {
  return async (ctx, next) => {
    let isSub = await ctx.telegram.getChatMember(process.env.CHANNEL_ID, ctx.from.id)
    if (isSub.status === "left") {

      const keyboard = {
        inline_keyboard: [
          [{ text: subscribeKeyboardMessage, url: subscribeLink }],
        ],
      };
      const options = {
        parse_mode: 'html',
        reply_markup: keyboard,
        disable_web_page_preview: true,
      };

      ctx.reply(subscribeMessage, options);
      return;
    } else return next()
  }
}