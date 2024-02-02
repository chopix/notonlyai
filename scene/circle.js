import {WizardScene} from "telegraf/scenes";
import 'dotenv/config'
import axios from "axios";
import fs from "fs";
import path from 'path';


export const circleScene = new WizardScene('circleScene', async (ctx) => {
  await ctx.reply('Скиньте видео, которое Вы хотите преобразовать в кружок 📹')
  await ctx.wizard.next()
}, async (ctx) => {
  if (ctx.message && ctx.message.animation) {
    const videoFileId = ctx.message.animation.file_id;

    // Get the file path using getFile method
    const file = await ctx.telegram.getFile(videoFileId);
    const filePath = file.file_path;

    // Get the direct link to the file
    const fileLink = `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;

    // Generate the download path
    const downloadPath = path.join(path.dirname, 'path', 'to', 'save', `${videoFileId}.mp4`);

    // Ensure the directory exists
    const directory = path.dirname(downloadPath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Download and save the video
    const response = await axios({
      method: 'get',
      url: fileLink,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);

    // Wait for the download to finish
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Reply with a video note
    await ctx.replyWithVideoNote({ source: fs.createReadStream(downloadPath) });

    // Optionally, you can delete the downloaded file if needed
    fs.unlinkSync(downloadPath);
  } else {
    // Если не видео, повторяем запрос
    await ctx.reply('Пожалуйста, отправьте видео.');
  }
})


// circleScene.on('video', async (ctx) => {
//   const video = ctx.message.video;
//
//   const fileId = video.file_id;
//   const file = await ctx.telegram.getFile(fileId);
//
//   const videoBuffer = await ctx.telegram.getFileStream(fileId);
//
//   const dateNow = Date.now();
//
//   const fileName = `video_${dateNow}.mp4`;
//   const filePath = `./downloads/${fileName}`;
//
//   const writeStream = fs.createWriteStream(filePath);
//   videoBuffer.pipe(writeStream);
//
//   writeStream.on('finish', () => {
//     console.log(`Видео сохранено: ${filePath}`);
//     ctx.reply('Видео успешно сохранено!');
//   });
// })