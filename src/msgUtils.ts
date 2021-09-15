import Telegraf from 'telegraf';
import config from './config';
import { Card, CardResponse, CardsResponse, Shop } from './types';

export const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
});

export const getCardsMsg = (cardsData: CardsResponse) => {
    return Object.entries(cardsData)
        .map(([model, cardData]) => getStatsCardMsg(model, cardData))
        .join('\n\n\n');
};

export const getStatsCardMsg = (model: string, cardData: CardResponse) =>
    `${model}:\n\n${getStatMsg(cardData)}`;

export const getAcceptablePriceCardsMsg = (cards: Card[]) => {
    return `Адекватная цена:\n\n${cards
        .map((card) => getCardMsg(card))
        .join('\n\n')}`;
};

export const getCardMsg = ({ price, name, shop }: Card) =>
    `${formatter.format(price)}\n${name}\n${getShopMsg(shop)}`;

export const getStatMsg = ({ priceStats }: CardResponse) =>
    Object.entries(priceStats)
        .map(([stat, card]) => `${stat}: ${getCardMsg(card)}}`)
        .join('\n\n');

export const getShopMsg = ({ link, name }: Shop) => {
    return `<a href="${link}">${name}</a>`;
};

export const sendMessage = (bot: Telegraf<any>, msg: string) =>
    bot.telegram.sendMessage(config.TELEGRAM_MAIN_CHAT!, msg, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    });
