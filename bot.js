import { Markup, session, Telegraf } from 'telegraf'
import 'dotenv/config'
import start from './commands/start.js'
import restart from './commands/restart.js'
import circle from './commands/circle.js'
import gpt from './commands/gpt.js'
import { Stage } from 'telegraf/scenes'
import { gptScene } from './scene/gpt.js'
import { sequelize } from './config/sequelize.js'
import cron from 'node-cron'
import updateFreeRequests from './helpers/updateFreeRequests.js'
import sendMessagesToAllUsers from './helpers/sendMessagesToAllUsers.js'
import draw from './commands/draw.js'
import { drawScene } from './scene/draw.js'
import profile from './commands/profile.js'
import subscribe from './commands/subscribe.js'
import isSubMiddleware from './middlewares/isSubMiddleware.js'
import isActiveSubscriptionMiddleware from './middlewares/isActiveSubscriptionMiddleware.js'
import { Subscribers } from './models/Subscribers.js'
import { User } from './models/User.js'
import { circleScene } from './scene/circle.js'
import express from 'express'
import * as ngrok from 'ngrok'

const bot = new Telegraf(process.env.TOKEN)

const stage = new Stage([gptScene, drawScene, circleScene])
bot.use(session())
bot.use(stage.middleware())

// bot.command('gpt', isActiveSubscriptionMiddleware, gpt)
// bot.command('circle', isActiveSubscriptionMiddleware, circle)
// bot.command('draw', isActiveSubscriptionMiddleware, draw)

bot.command('adminSubscribe', async ctx => {
	const tgId = ctx.from.id
	let currentTimeMillis = Date.now()
	let currentDate = new Date(currentTimeMillis)

	let year = currentDate.getFullYear()
	let month = ('0' + (currentDate.getMonth() + 1)).slice(-2) // добавляем ноль перед месяцем
	let day = ('0' + currentDate.getDate()).slice(-2) // добавляем ноль перед днем
	let hours = ('0' + currentDate.getHours()).slice(-2) // добавляем ноль перед часами
	let minutes = ('0' + currentDate.getMinutes()).slice(-2) // добавляем ноль перед минутами
	let seconds = ('0' + currentDate.getSeconds()).slice(-2) // добавляем ноль перед секундами

	let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

	await Subscribers.update(
		{ type: 4, active: 1, start: formattedDate },
		{ where: { tgId: tgId } }
	)
	ctx.reply('подписка выдана')
})

sequelize.sync()

cron.schedule('0 0 * * *', async () => {
	await updateFreeRequests()
	await sendMessagesToAllUsers(bot)
})

cron.schedule('0 0 1 * *', async () => {
	const users = await User.findAll()
	for (const user of users) {
		await user.update({ dalleRequestsCount: 0 })
	}
})

bot.use(start, restart, profile, subscribe, gpt, circle, draw)
bot.use(isSubMiddleware())

import bodyParser from 'body-parser'

const app = express()
import { WalletPaySDK } from 'wallet-pay-sdk'
const wp = new WalletPaySDK({
	apiKey: 'M4DwQAaQ7THbiAoaqzf25ee24oQygNF4ytJ0',
	timeoutSeconds: 60 * 60 * 3, // Default value = Order TTL, if the order is not paid within the timeout period
})
app.use(bodyParser.json())
app.post('/webhook', async (req, res) => {
	try {
		const payload = req.body[0].payload
		console.log(payload)
		bot.telegram.sendMessage(
			740207590,
			`Платеж на сумму ${payload.orderAmount.amount} ${payload.orderAmount.currencyCode} (${payload.selectedPaymentOption.amount.amount} ${payload.selectedPaymentOption.amount.currencyCode}) от пользователя ${payload.customData} успешно выполнен.`
		)
		bot.telegram.sendMessage(
			Number(payload.customData),
			`Платеж на сумму ${payload.orderAmount.amount} ${payload.orderAmount.currencyCode} успешно выполнен.`
		)
		res.status(200).send('OK')
		// console.log(er)
	} catch (e) {
		console.log(e)
	}
})

bot.command('pay', async ctx => {
	await ctx.reply('payment')
	const newOrder = {
		amount: {
			currencyCode: ECurrencyCode.USDT,
			amount: '0.01',
		},
		description: 'My first order', // Description of the order
		returnUrl: 'https://example.com', //  Url to redirect after paying order
		failReturnUrl: 'https://example.com', // Url to redirect after unsuccessful order completion (expiration/cancelation/etc)
		externalId: crypto.randomUUID(),
		// timeoutSeconds: 200000; // If you want, you can override the value of the "timeoutSeconds" variable here
		customerTelegramUserId: ctx.from.id, // The customer's telegram id (User_id)
	}

	const result = await wp.createOrder(newOrder).then(async res => {
		console.log(res)
		await ctx.reply(
			`payment`,
			Markup.inlineKeyboard([
				Markup.button.url('pay', res.response.data.payLink),
			])
		)
	})
})

// Запуск сервера на порте 3000
app.listen(5124, () => {
	console.log('Сервер запущен на порту 5124')
	// ngrok.connect(5124).then(ngrokUrl => {
	//   console.log(`ngrok ${ngrokUrl}`)
	// });
})

bot.launch()
