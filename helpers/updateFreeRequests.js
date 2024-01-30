
import {User} from "../models/User.js";

export default async () => {
  const users = await User.findAll();
  for (const user of users) {
    await user.update({ freeRequests: 0 });
  }
}