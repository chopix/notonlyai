import {Composer} from "telegraf";
import {successMessage} from "../messages/restart.js";
import {errorMessage} from "../messages/global.js";
import pool from "../config/mysql.js";


const composer = new Composer()





composer.command('restart', async (ctx) => {
    const chatId = ctx.from.id
    pool.query(
        "SELECT * FROM users WHERE `tg_id`=?", [chatId.toString()],
        function(err, result) {
            if (err) {
                return console.log(err);
            }

            if (!result.length) {
                return ctx
                    .reply(errorMessage
                        , {
                            parse_mode: "html",
                            reply_markup: {
                                inline_keyboard: [
                                    [{
                                        text: "Купить подписку ⚡️",
                                        callback_data: "subscribe",
                                    }, ],
                                ],
                            },
                        }
                    )

                    .catch((e) => {
                        console.log(e);
                    });
            }

            // if (result[0].state !== "stable") {
            //     return;
            // }

            pool.query(
                "UPDATE `users` SET `state` = 'stable', `gpt_messages` = '[]' WHERE `tg_id` = ?", [chatId.toString()],
                function(err, result_sub) {
                    if (err) {
                        return console.log(err);
                    }

                    return ctx
                        .reply(successMessage, {
                                parse_mode: "html",
                            }
                        )

                        .catch((e) => {
                            console.log(e);
                        });
                }
            );
        }
    );

})

export default composer;