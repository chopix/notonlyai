import {User} from "../models/User.js";
import {requestsUpdated} from "../messages/requestsUpdated.js";

export default async (bot) => {
  const users = User.findAll()
  for (const user of users) {
    await bot.telegram.sendMessage(user.tgId, requestsUpdated)
  }
}