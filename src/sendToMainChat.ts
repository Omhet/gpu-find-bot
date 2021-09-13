import { bot } from './bot';
import config from './config';
import { CardResponse, CardsResponse, Shop } from './types';
import { fetchCards } from './utils';

const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
});

const getCardsMsg = (cardsData: CardsResponse) => {
    return Object.entries(cardsData)
        .map(([model, cardData]) => `${model}:\n\n${getCardMsg(cardData)}`)
        .join('\n\n\n');
};

const getCardMsg = ({ stats }: CardResponse) =>
    Object.entries(stats)
        .map(
            ([stat, { shop, price, name }]) =>
                `${stat}: ${formatter.format(price)}\n${name}\n${getShopMsg(
                    shop
                )}`
        )
        .join('\n\n');

const getShopMsg = ({ link, name }: Shop) => {
    return `<a href="${link}">${name}</a>`;
};

(async () => {
    const cardsData = await fetchCards();

    const cardsMsg = getCardsMsg(cardsData);

    await bot.telegram.sendMessage(config.TELEGRAM_MAIN_CHAT!, cardsMsg, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    });
})();
