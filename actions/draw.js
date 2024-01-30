import {subscribeSecondMessage} from "../messages/start.js";

export const dalleStop = async (ctx) => {
  await ctx.scene.leave()
  return ctx.reply(subscribeSecondMessage, {
    parse_mode: "HTML"
  })
}