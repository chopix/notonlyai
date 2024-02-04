import {Composer} from "telegraf";


const composer = new Composer()





composer.command('restart', async (ctx) => {
    const chatId = ctx.from.id
    await ctx.scene.leave();
    await ctx.reply('Бот успешно перезагружен ✅')

})

export default composer;