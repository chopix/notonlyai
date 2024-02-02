import {Composer} from "telegraf";
import {sendErrorMessage, sendTokenExpiredMessage} from "../helpers/errorAndTokensExpired.js";
import {selectTaskMessage, sendMessageMessage} from "../messages/gpt.js";
import {WizardScene} from "telegraf/scenes";
import {gptBack, gptFour, gptPlan, gptPost, gptRequest, gptStop, gptStory, gptThree} from "../actions/gpt.js";
import {User} from "../models/User.js";

const composer = new Composer()


composer.action('gpt request', async (ctx) => gptRequest(ctx))
composer.action('gpt post', async (ctx) => gptPost(ctx))
composer.action('gpt plan', async (ctx) => gptPlan(ctx))
composer.action('gpt story', async (ctx) => gptStory(ctx))
composer.action('gpt 3.5', async (ctx) => gptThree(ctx))
composer.action('gpt 4', async (ctx) => gptFour(ctx))
composer.action('gpt stop', async (ctx) => gptStop(ctx))
composer.action('gpt back', async (ctx) => gptBack(ctx))



composer.command('gpt', async (ctx) => {
    const chatId = ctx.from.id;

    const user = await User.findOne({
      where: {
        tgId: chatId
      }
    })
    if(!user) {
      return sendErrorMessage(ctx)
    }

  return ctx
    .reply(selectTaskMessage, {
        parse_mode: "html",
        reply_markup: {
          inline_keyboard: [
            [{
              text: "Пост 📜",
              callback_data: "gpt post",
            },
              {
                text: "Контент-план 🗂",
                callback_data: "gpt plan",
              },
            ],
            [{
              text: "Сторителлинг 🗣",
              callback_data: "gpt story",
            }, ],
            [{
              text: "Свободный запрос 🔮",
              callback_data: "gpt request",
            }, ],
          ],
        },
      }
    )

    .catch((e) => {
      console.log(e);
    });
})




export default composer;