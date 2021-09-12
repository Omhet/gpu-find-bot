import Telegraf from 'telegraf';
import config from './config';

export const bot = new Telegraf(config.BOT_TOKEN!);
bot.launch();
console.log('Bot started');

bot.start(async (ctx) => {
    await ctx.reply('Привет!');
});
