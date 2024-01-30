import {Composer, Input, Markup} from "telegraf";
import 'dotenv/config'
import isSub from "../helpers/isSub.js";
import fs from 'fs'
import {subscribeSecondMessage} from './../messages/start.js'
import {User} from "../models/User.js";
import {Subscribers} from "../models/Subscribers.js";

const composer = new Composer()

composer.start(async (ctx) => {
    const chatId = ctx.from.id;
    const isSubscribed = await isSub(ctx);
    if(isSubscribed) {
      const [user, createdUser] = await User.findOrCreate({
        where: {
          tgId: chatId,
        },
      });
      const [subscriber, createdSubscriber] = await Subscribers.findOrCreate({
        where: {
          tgId: chatId,
        },
        defaults: {
          period: 0,
          active: false,
        },
      });

      // return await ctx.replyWithVideoNote(Input.fromReadableStream(fs.createReadStream('./data/welcome/welcome.mp4'))).then(async (res) => {
      //   await ctx.reply(subscribeSecondMessage, {
      //     parse_mode: "html",
      //   })
      // })
      return ctx.reply(subscribeSecondMessage, {
        parse_mode: "HTML"
      })
    }

})

export default composer;