import {WizardScene} from "telegraf/scenes";
import {describeImageMessage} from "../messages/draw.js";
import openai from "../config/openai.js";
import imageService from "../services/imageService.js";
import {User} from "../models/User.js";
import composer from "../commands/draw.js";
import {dalleStop} from "../actions/draw.js";

export const drawScene = new WizardScene(
  'drawScene', async (ctx) => {
    const tgId = ctx.from.id;
    await ctx
      .reply(describeImageMessage, {
          parse_mode: "html",
          reply_markup: {
            inline_keyboard: [
              [{
                text: "Отменить 🚫",
                callback_data: "dalle stop",
              },],
            ],
          },
        }
      )
    await ctx.wizard.next();
  },
  async(ctx) => {
    const message = ctx.message.text
    const tgId = ctx.from.id;
    await ctx.reply('Ваша картинка генерируется...')
    await imageService(message, ctx);
    const existingMessages = await User.findOne({
      attributes: ['dalleMessages'],
      where: { tgId: tgId },
    });

    const currentMessages = JSON.parse(existingMessages.dalleMessages);
    currentMessages.push(message);

    await User.update(
      { dalleMessages: JSON.stringify(currentMessages) },
      { where: { tgId: tgId } }
    );
    await ctx.scene.leave()
  }
)

drawScene.action('dalle stop', async (ctx) => dalleStop(ctx))