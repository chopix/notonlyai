import { Composer } from 'telegraf'
import { sendErrorMessage } from '../helpers/errorAndTokensExpired.js'
import { subscribeMessage } from '../messages/subscribe.js'
import { User } from '../models/User.js'
import 'dotenv/config'
import { Subscribers } from '../models/Subscribers.js'
import { WalletPaySDK } from 'wallet-pay-sdk'
import { ECurrencyCode } from 'wallet-pay-sdk/lib/src/types.js'
import crypto from 'crypto'
import { Markup } from 'telegraf'
const wp = new WalletPaySDK({
	apiKey: 'M4DwQAaQ7THbiAoaqzf25ee24oQygNF4ytJ0',
	timeoutSeconds: 60 * 60 * 3, // Default value = Order TTL, if the order is not paid within the timeout period
})

const composer = new Composer()

composer.action('sub 1', async ctx => {
	// const invoice = {
	//   provider_token: process.env.PAYMENTS_KEY, // Replace with your provider token
	//   start_parameter: 'invoice123',
	//   title: 'GPT 3.5',
	//   description: 'Безлимитное количество запросов GPT 3.5 - 350₽/месяц',
	//   currency: 'RUB',
	//   prices: [
	//     { label: 'Product 1', amount: 35000 }, // Amount is in cents
	//   ],
	//   payload: 'custom_payload',
	// };

	// ctx.replyWithInvoice(invoice);
	const newOrder = {
		amount: {
			currencyCode: ECurrencyCode.RUB,
			amount: '0.1',
		},
		description: 'Безлимитное количество запросов GPT 3.5 - 350₽/месяц', // Description of the order
		externalId: crypto.randomUUID(),
		customData: `${ctx.from.id}`,
		customerTelegramUserId: ctx.from.id, // The customer's telegram id (User_id)
	}

	const result = await wp.createOrder(newOrder).then(async res => {
		console.log(res)
		await ctx.reply(
			`Нажмите на кнопку ниже, чтобы оплатить 💸`,
			Markup.inlineKeyboard([
				Markup.button.url('Оплатить', res.response.data.payLink),
			])
		)
	})
	ctx.type = 1
})

composer.action('sub 2', async ctx => {
	const newOrder = {
		amount: {
			currencyCode: ECurrencyCode.RUB,
			amount: '10',
		},
		description: 'Безлимитное GPT 3.5 + GPT 4',
		externalId: crypto.randomUUID(),
		customerTelegramUserId: ctx.from.id, // The customer's telegram id (User_id)
	}

	const result = await wp.createOrder(newOrder).then(async res => {
		console.log(res)
		await ctx.reply(
			`Нажмите на кнопку ниже, чтобы оплатить 💸`,
			Markup.inlineKeyboard([
				Markup.button.url('Оплатить', res.response.data.payLink),
			])
		)
	})
	ctx.type = 2
})

composer.action('sub 3', async ctx => {
	// const invoice = {
	// 	provider_token: process.env.PAYMENTS_KEY, // Replace with your provider token
	// 	start_parameter: 'invoice12345',
	// 	title: 'Midjourney + DALL-E 3',
	// 	description: 'Midjourney + DALL-E 3 - 1250₽/месяц (лимит 100 запросов)',
	// 	currency: 'RUB',
	// 	prices: [
	// 		{ label: 'Product 3', amount: 125000 }, // Amount is in cents
	// 	],
	// 	payload: 'custom_payload',
	// }

	// ctx.replyWithInvoice(invoice)
	const newOrder = {
		amount: {
			currencyCode: ECurrencyCode.RUB,
			amount: '10',
		},
		description: 'Midjourney + DALL-E 3 100 запросов', // Description of the order
		externalId: crypto.randomUUID(),
		customerTelegramUserId: ctx.from.id, // The customer's telegram id (User_id)
	}

	const result = await wp.createOrder(newOrder).then(async res => {
		console.log(res)
		await ctx.reply(
			`Нажмите на кнопку ниже, чтобы оплатить 💸`,
			Markup.inlineKeyboard([
				Markup.button.url('Оплатить', res.response.data.payLink),
			])
		)
	})
	ctx.type = 3
})

composer.action('sub 4', async ctx => {
	// const invoice = {
	// 	provider_token: process.env.PAYMENTS_KEY, // Replace with your provider token
	// 	start_parameter: 'invoice12367',
	// 	title: 'GPT 3.5 + GPT 4 + Midjourney + DALL-E 3 ',
	// 	description:
	// 		'GPT 3.5 + GPT 4 + Midjourney + DALL-E 3  - 2500₽/месяц (GPT безлимит, Midjourney + DALL-E 3 - 150 картинок)',
	// 	currency: 'RUB',
	// 	prices: [
	// 		{ label: 'Product 4', amount: 250000 }, // Amount is in cents
	// 	],
	// 	payload: 'custom_payload',
	// }

	// ctx.replyWithInvoice(invoice)
	const newOrder = {
		amount: {
			currencyCode: ECurrencyCode.RUB,
			amount: '10',
		},
		description:
			'GPT 3.5 + GPT 4 + Midjourney + DALL-E 3  (безлимит, 150 картинок)', // Description of the order
		externalId: crypto.randomUUID(),
		customerTelegramUserId: ctx.from.id, // The customer's telegram id (User_id)
	}

	const result = await wp.createOrder(newOrder).then(async res => {
		console.log(res)
		await ctx.reply(
			`Нажмите на кнопку ниже, чтобы оплатить 💸`,
			Markup.inlineKeyboard([
				Markup.button.url('Оплатить', res.response.data.payLink),
			])
		)
	})
	ctx.type = 4
})

// composer.on('pre_checkout_query', async ctx => {
// 	ctx.answerPreCheckoutQuery(true)
// })

// composer.on('successful_payment', async ctx => {
// 	const tgId = ctx.from.id
// 	let currentTimeMillis = Date.now()
// 	let currentDate = new Date(currentTimeMillis)

// 	let year = currentDate.getFullYear()
// 	let month = ('0' + (currentDate.getMonth() + 1)).slice(-2) // добавляем ноль перед месяцем
// 	let day = ('0' + currentDate.getDate()).slice(-2) // добавляем ноль перед днем
// 	let hours = ('0' + currentDate.getHours()).slice(-2) // добавляем ноль перед часами
// 	let minutes = ('0' + currentDate.getMinutes()).slice(-2) // добавляем ноль перед минутами
// 	let seconds = ('0' + currentDate.getSeconds()).slice(-2) // добавляем ноль перед секундами

// 	let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
// 	await Subscribers.update(
// 		{ type: ctx.type, start: formattedDate },
// 		{
// 			where: { tgId: tgId },
// 		}
// 	)
// 	ctx.reply('Оплата прошла успешно')
// })

composer.command('subscribe', async ctx => {
	const chatId = ctx.from.id
	const user = await User.findOne({
		where: {
			tgId: chatId,
		},
	})
	if (!user) {
		return sendErrorMessage(ctx)
	}

	return ctx
		.reply(subscribeMessage, {
			parse_mode: 'html',
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: 'Безлим. GPT 3.5 🌑',
							callback_data: 'sub 1',
						},
					],
					[
						{
							text: 'Безлим GPT 3.5 + GPT 4 🌒',
							callback_data: 'sub 2',
						},
					],
					[
						{
							text: 'Midjourney + DALL-E 3 🌓',
							callback_data: 'sub 3',
						},
					],
					[
						{
							text: 'GPT 3.5 + GPT 4 + Midjourney + DALL-E 3 🌔',
							callback_data: 'sub 4',
						},
					],
				],
			},
			disable_web_page_preview: true,
		})
		.catch(err => {
			console.log(err)
		})
})

export default composer
