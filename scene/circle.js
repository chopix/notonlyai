import {WizardScene} from "telegraf/scenes";
import 'dotenv/config'
import ffmpeg from 'fluent-ffmpeg';
import request from "request";
import path from 'path'
import fs from "fs";

// Use import.meta.url to get the current module's URL
const __filename = new URL(import.meta.url).pathname;
// Use path.dirname to get the directory name
const __dirname = path.dirname(__filename);


const download = (url, filePath, callback) => {
  request({
    uri: url,  // Use uri property instead of passing url directly
    method: 'GET',
  })
    .on('response', (response) => {
      if (response.statusCode === 200) {
        // Pipe the response to the file stream
        response.pipe(fs.createWriteStream(filePath).on('close', callback));
      } else {
        console.error('Failed to download the file. HTTP Status Code:', response.statusCode);
        callback(new Error('Failed to download the file.'));
      }
    })
    .on('error', (err) => {
      console.error('Error during file download:', err);
      callback(err);
    });
};


export const circleScene = new WizardScene('circleScene', async (ctx) => {
  await ctx.reply('Скиньте видео, которое Вы хотите преобразовать в кружок 📹');
  await ctx.wizard.next();
}, async (ctx) => {
  if (ctx.message && ctx.message.animation) {
    const fileId = ctx.message.animation.file_id;

    let start = Math.min(ctx.message.animation.width, ctx.message.animation.height);

    if (start > 600) {
      start = 600;
    }

    ctx.telegram.getFileLink(fileId).then((resp) => {
      download(
        resp,
        path.join(
          __dirname,
          `../data/circles/${fileId}.mp4`
        ),
        () => {
          setTimeout(() => {
            const command = ffmpeg(
              path.join(
                __dirname,
                `../data/circles/${fileId}.mp4`
              )
            );

            // Установка размеров кадра
            command.size(start + "x" + start);

            // Вырезание видео
            command.outputOptions([
              "-vf",
              "crop=" + start + ":" + start,
            ]);

            // Назначение пути к выходному файлу
            command.save(
              path.join(
                __dirname,
                `../data/circles/${fileId}__crop.mp4`
              )
            );

            let ctd = 0;

            if (
              fs.existsSync(
                path.join(
                  __dirname,
                  `../data/circles/${fileId}__crop.mp4`
                )
              )
            ) {
              return;
            }

            command
              .on("end", () => {
                if (ctd == 1) {
                  return;
                }

                ctd = 1;

                console.log("Вырезание квадрата завершено");

                return ctx
                  .replyWithVideoNote(
                    path.join(
                      __dirname,
                      `../data/circles/${fileId}__crop.mp4`
                    )
                  );
              })
              .on("error", (err) => {
                console.error("Ошибка при обрезке видео:", err);
              })
              .run();
          }, 250);
        }
      );
    });
  } else {
    await ctx.reply('Пожалуйста, отправьте видео.');
  }
});

