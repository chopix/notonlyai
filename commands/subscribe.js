import {Composer} from "telegraf";
import isSub from "../helpers/isSub.js";
import pool from '../config/mysql.js'
import {sendErrorMessage} from "../helpers/errorAndTokensExpired.js";
import {subscribeMessage} from "../messages/subscribe.js";

const composer = new Composer()


composer.command('subscribe', async (ctx) => {
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

            return ctx
                .reply(subscribeMessage, {
                        parse_mode: "html",
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: "1 день 🌑",
                                    callback_data: "sub 1",
                                },
                                    {
                                        text: "7 дней 🌒",
                                        callback_data: "sub 2",
                                    },
                                    {
                                        text: "31 день 🌓",
                                        callback_data: "sub 3",
                                    },
                                ],
                                [{
                                    text: "365 дней 🌔",
                                    callback_data: "sub 4",
                                },
                                    {
                                        text: "Навсегда 🌕",
                                        callback_data: "sub 5",
                                    },
                                ],
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

export default composer