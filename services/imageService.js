import axios from "axios";
import 'dotenv/config'
import fs from "fs";
import openai from "../config/openai.js";
import {message} from "telegraf/filters";
import {errorMessage} from "../messages/draw.js";


export default async (text, ctx) => {

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: text,
    n: 1,
    size: '1024x1024'
  }).then(async res => {
    await ctx.replyWithPhoto(res.data[0].url)
    await ctx.scene.leave()
  }).catch(async e => {
    console.log(e)
    await ctx.reply(errorMessage, {
      parse_mode: "HTML"
    })
    await ctx.scene.leave()
  })
}