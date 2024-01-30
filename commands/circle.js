import {Composer} from "telegraf";
import isSub from "../helpers/isSub.js";
import pool from "../config/mysql.js";
import {sendVideoMessage, unavailableMessage} from "../messages/circle.js";
import {errorMessage, tokensExpiredMessage} from '../messages/global.js'
import {sendTokenExpiredMessage, sendErrorMessage} from "../helpers/errorAndTokensExpired.js";
import {User} from "../models/User.js";

const composer = new Composer()


composer.command('circle', async (ctx) => {
    const isSubscriber = await isSub(ctx)
    const chatId = ctx.from.id;
    if(isSubscriber) {
      const user = await User.findOne({
        where: {
          tgId: chatId
        }
      })
      if(!user) {
        return sendErrorMessage(ctx)
      }
    }


})

export default composer;