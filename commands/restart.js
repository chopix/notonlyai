import {Composer} from "telegraf";
import {successMessage} from "../messages/restart.js";
import {errorMessage} from "../messages/global.js";
import pool from "../config/mysql.js";


const composer = new Composer()





composer.command('restart', async (ctx) => {
    const chatId = ctx.from.id
    await ctx.scene.leave();
    await ctx.reply('Бот успешно перезагружен ✅')

})

export default composer;