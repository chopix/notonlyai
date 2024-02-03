import { Composer } from "telegraf";
import { sendErrorMessage } from "../helpers/errorAndTokensExpired.js";
import { User } from "../models/User.js";
import request from 'request';
import ffmpeg from "fluent-ffmpeg";
import fs from 'fs';
import { exec } from 'child_process';

const composer = new Composer();

const download = (url, filePath, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(filePath)).on("close", callback);
  });
};

composer.command('circle', async (ctx) => {
  const chatId = ctx.from.id;
  const user = await User.findOne({
    where: {
      tgId: chatId
    }
  });
  if (!user) {
    return sendErrorMessage(ctx);
  }
  await ctx.scene.enter('circleScene');
});

// composer.on('video', async (ctx) => {
//   const fileId = ctx.message.video.file_id;
//
//   let start = Math.min(ctx.message.video.width, ctx.message.video.height);
//
//   if (start > 600) {
//     start = 600;
//   }
//
//   try {
//     const file = await ctx.telegram.getFile(fileId);
//     const fileLink = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
//
//     download(
//       fileLink,
//       `./../../data/circles/${fileId}.mp4`,
//       () => {
//         setTimeout(() => {
//           const command = ffmpeg(`./../../data/circles/${fileId}.mp4`);
//
//           command.size(`${start}x${start}`);
//           command.outputOptions([
//             '-vf',
//             `crop=${start}:${start}`,
//           ]);
//           command.save(`./../../data/circles/${fileId}__crop.mp4`);
//
//           let ctd = 0;
//
//           if (fs.existsSync(`./../../data/circles/${fileId}__crop.mp4`)) {
//             return;
//           }
//
//           command
//             .on('end', () => {
//               if (ctd === 1) {
//                 return;
//               }
//
//               ctd = 1;
//
//               console.log('Обрезка видео завершена');
//
//               ctx.replyWithVideoNote({
//                 source: `./../../data/circles/${fileId}__crop.mp4`,
//               });
//
//               ctx.reply('Твой кружок <b>готов</b> 🔥', {
//                 parse_mode: 'html',
//               });
//             })
//             .on('error', (err) => {
//               console.error('Ошибка при обрезке видео:', err);
//             })
//             .run();
//         }, 250);
//       }
//     );
//
//   } catch (error) {
//     console.error('Ошибка получения информации о файле:', error);
//   }
// });

export default composer;