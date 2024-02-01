import {Composer} from "telegraf";
import pool from './../config/mysql.js'
import {describeImageMessage} from "../messages/draw.js";
import {errorMessage, tokensExpiredMessage} from '../messages/global.js'
import {sendErrorMessage, sendTokenExpiredMessage} from "../helpers/errorAndTokensExpired.js";
import {dalleStop} from "../actions/draw.js";

const composer = new Composer()




composer.command('draw', async (ctx) => {
    const chatId = ctx.from.id;
    const user = sendErrorMessage(ctx, chatId)
    const subscriber = sendTokenExpiredMessage(ctx,chatId)

    if(user && subscriber) {
      await ctx.scene.enter('drawScene')
    }

})

export default composer;