import Telegraf from 'telegraf';
import config from './config';
import { getCardsMsg, getStatsCardsMsg, sendMessage } from './msgUtils';
import { CardsResponse } from './types';
import { fetchCards } from './utils';

const bot = new Telegraf(config.BOT_TOKEN!);
const date = new Date();
const currentHours = date.getHours() + 3;

const sendMessageIfPriceIsAcceptable = async (cardsData: CardsResponse) => {
    for (const [model, cardData] of Object.entries(cardsData)) {
        const acceptablePriceCards = cardData.cards
            .filter(({ isAcceptablePrice }) => isAcceptablePrice)
            .slice(0, 10);

        if (acceptablePriceCards.length > 0) {
            const msg = `Адекватная цена на ${model}:\n\n${getCardsMsg(
                acceptablePriceCards
            )}`;
            await sendMessage(bot, msg);
        }
    }
};

const send = async () => {
    await sendMessage(bot, 'Получаю данные...');

    const cardsData = await fetchCards();

    const msg = getStatsCardsMsg(cardsData);
    await sendMessage(bot, msg);

    await sendMessageIfPriceIsAcceptable(cardsData);
};

(async () => {
    if (config.IS_DEV) {
        const cardsData = await fetchCards();

        const msg = getStatsCardsMsg(cardsData);
        await sendMessage(bot, msg);

        await sendMessageIfPriceIsAcceptable(cardsData);

        return;
    }

    let isSent = false;
    let tries = 0;

    if (currentHours % 4 == 0) {
        while (!isSent || tries < 4) {
            try {
                await send();
                isSent = true;
            } catch (error) {
                await sendMessage(bot, `Error fetching cards: ${error}`);
                tries++;
            }
        }
    }

    await sendMessage(bot, `Hours: ${currentHours}`);
})();
