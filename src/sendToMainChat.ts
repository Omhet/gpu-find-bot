import { bot } from './bot';
import config from './config';
import { fetchCardPrices } from './utils';

(async () => {
    const prices = await fetchCardPrices();
    const msg = prices
        .map(
            ({ cardName, shopPrices }: { cardName: string; shopPrices: any }) =>
                `${cardName}:\n${getShopPricesMsg(shopPrices)}\n\n`
        )
        .join('\n');

    await bot.telegram.sendMessage(config.TELEGRAM_MAIN_CHAT!, msg);
})();

const getShopPricesMsg = (shopPrices: any) => {
    return Object.entries(shopPrices)
        .map(([shop, price]) => `${shop}: ${price}`)
        .join('\n');
};
