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
    await ctx.scene.enter('circleScene')
})

// composer.on('video', async (ctx) => {
//   if(ctx.message.video) {
//     const video = ctx.message.video;
//
//     const fileId = video.file_id;
//     const file = await ctx.telegram.getFile(fileId);
//
//     const videoBuffer = await ctx.telegram.getFileStream(fileId);
//
//     const fileName = `video_${Date.now()}.mp4`;
//     const filePath = `./downloads/${fileName}`;
//
//     const writeStream = fs.createWriteStream(filePath);
//     videoBuffer.pipe(writeStream);
//
//     writeStream.on('finish', () => {
//       console.log(`Видео сохранено: ${filePath}`);
//       ctx.reply('Видео успешно сохранено!');
//     });
//   }
// })

export default composer;