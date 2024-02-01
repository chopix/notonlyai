import {Composer} from "telegraf";
import pool from "../config/mysql.js";
import {sendVideoMessage, unavailableMessage} from "../messages/circle.js";
import {errorMessage, tokensExpiredMessage} from '../messages/global.js'
import {sendTokenExpiredMessage, sendErrorMessage} from "../helpers/errorAndTokensExpired.js";
import {User} from "../models/User.js";

const composer = new Composer()


composer.command('circle', async (ctx) => {
    const chatId = ctx.from.id;
    const user = await User.findOne({
      where: {
        tgId: chatId
      }
    })
    if(!user) {
      return sendErrorMessage(ctx)
    }


})

export default composer;