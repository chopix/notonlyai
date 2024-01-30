import {dialogStoped, selectTaskMessage, sendMessageMessage} from "../messages/gpt.js";



export const gptRequest = async (ctx) => {
    ctx.session.actionType = 'gpt request'
    ctx.reply(sendMessageMessage, {
        parse_mode: "html",
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "GPT-3.5 🤖",
                    callback_data: "gpt 3.5",
                },
                    {
                        text: "GPT-4 🤖",
                        callback_data: "gpt 4",
                    },
                ],
            ],
        },
    })
}


export const gptPost = async (ctx) => {
    ctx.session.actionType = 'gpt post'
    ctx.reply(sendMessageMessage, {
        parse_mode: "html",
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "GPT-3.5 🤖",
                    callback_data: "gpt 3.5",
                },
                    {
                        text: "GPT-4 🤖",
                        callback_data: "gpt 4",
                    },
                ],
            ],
        },
    })
}


export const gptPlan = async (ctx) => {
    ctx.session.actionType = 'gpt plan'
    ctx.reply(sendMessageMessage, {
        parse_mode: "html",
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "GPT-3.5 🤖",
                    callback_data: "gpt 3.5",
                },
                    {
                        text: "GPT-4 🤖",
                        callback_data: "gpt 4",
                    },
                ],
            ],
        },
    })
}


export const gptStory = async (ctx) => {
    ctx.session.actionType = 'gpt story'
    ctx.reply(sendMessageMessage, {
        parse_mode: "html",
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "GPT-3.5 🤖",
                    callback_data: "gpt 3.5",
                },
                    {
                        text: "GPT-4 🤖",
                        callback_data: "gpt 4",
                    },
                ],
            ],
        },
    })
}


export const gptThree = async (ctx) => {
    ctx.session.gptModel = 'gpt-3.5-turbo'
    await ctx.scene.enter('gptScene')
}


export const gptFour = async (ctx) => {
    ctx.session.gptModel = 'gpt-4-0125-preview'
    await ctx.scene.enter('gptScene')
}


export const gptStop = async(ctx) => {
    console.log('asdsad')
    await ctx.reply(dialogStoped, {
        parse_mode: 'HTML'
    })
    await ctx.scene.leave()
}

export const gptBack = async (ctx) => {
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
}
