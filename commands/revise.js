import {Composer} from "telegraf";
import isSub from "../helpers/isSub.js";
import pool from '../config/mysql.js'
import {sendErrorMessage, sendTokenExpiredMessage} from "../helpers/errorAndTokensExpired.js";
import {reviseMessage} from "../messages/revise.js";

const composer = Composer()

composer.command('revise', async (ctx) => {
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

            pool.query(
                "SELECT * FROM subscribes WHERE `tg_id`=?", [chatId.toString()],
                function(err, result_sub) {
                    if (err) {
                        return console.log(err);
                    }

                    let limits = JSON.parse(result[0].limits);

                    if (result_sub[0].active == 0 && limits.revise == 0) {
                        return sendTokenExpiredMessage(ctx)

                            .catch((e) => {
                                console.log(e);
                            });
                    }

                    return ctx
                        .reply(reviseMessage, {
                                parse_mode: "html",
                                reply_markup: {
                                    inline_keyboard: [
                                        [{
                                            text: "Отменить 🚫",
                                            callback_data: "cancel",
                                        }, ],
                                    ],
                                },
                            }
                        )
                        .then((res) => {
                            pool.query(
                                "UPDATE users SET `state` = ?, `msg` = ? WHERE `tg_id`=?", ["revise", res.message_id.toString(), chatId.toString()],
                                function(err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                }
                            );
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                }
            );
        }
    );
});


export default composer;