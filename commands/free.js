import {Composer} from "telegraf";
import {sendErrorMessage} from "../helpers/errorAndTokensExpired.js";
import {alreadyGiftTakenMessage, freeSubscriptionMessage} from "../messages/free.js";
import isSub from "../helpers/isSub.js";
import pool from '../config/mysql.js'

const composer = new Composer()


composer.command('free', async (ctx) => {

    await isSub(ctx)
    const chatId = ctx.from.id;

    pool.query(
        "SELECT * FROM users WHERE `tg_id`=?", [chatId.toString()],
        function(err, result) {
            if (err) {
                return console.log(err);
            }

            if (!result.length) {
                return sendErrorMessage(ctx)

                    .catch((e) => {
                        console.log(e);
                    });
            }

            if (result[0].state !== "stable") {
                return;
            }

            if (result[0].sub_channel == 1) {
                return ctx
                    .reply(alreadyGiftTakenMessage, {
                        parse_mode: "html",
                        disable_web_page_preview: true,
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

            return bot
                .sendMessage(freeSubscriptionMessage, {
                        parse_mode: "html",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "Наш канал 🔗",
                                    url: "https://t.me/kirti_news",
                                }, ],
                                [{
                                    text: "Я подписался 🎉",
                                    callback_data: "free",
                                }, ],
                            ],
                        },
                        disable_web_page_preview: true,
                    }
                )
                .catch((err) => {
                    console.log(err);
                });
        }
    );
})

export default composer;