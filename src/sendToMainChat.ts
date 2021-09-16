import Telegraf from 'telegraf';
import config from './config';
import { getCardsMsg, getStatsCardsMsg, sendMessage } from './msgUtils';
import { CardsResponse } from './types';
import { fetchCards } from './utils';

const bot = new Telegraf(config.BOT_TOKEN!);
const date = new Date();
const currentHours = date.getHours();

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

(async () => {
    try {
        const cardsData = await fetchCards();
        await sendMessageIfPriceIsAcceptable(cardsData);

        if (currentHours > 9 && currentHours < 11) {
            const msg = getStatsCardsMsg(cardsData);
            await sendMessage(bot, msg);
        }
    } catch (error) {
        await sendMessage(bot, `Error fetching cards: ${error}`);
    }

    await sendMessage(bot, `Hours: ${currentHours}`);
})();
