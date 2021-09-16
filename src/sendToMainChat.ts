import Telegraf from 'telegraf';
import config from './config';
import {
    getAcceptablePriceCardsMsg,
    getCardsMsg,
    sendMessage,
} from './msgUtils';
import { CardsResponse } from './types';
import { fetchCards } from './utils';

const bot = new Telegraf(config.BOT_TOKEN!);
const date = new Date();
const currentHours = date.getHours();

const sendMessageIfPriceIsAcceptable = async (cardsData: CardsResponse) => {
    const allCards = Object.values(cardsData).flatMap(({ priceStats }) =>
        Object.values(priceStats)
    );
    const acceptablePriceCards = allCards.filter(
        ({ isAcceptablePrice }) => isAcceptablePrice
    );
    const msg = getAcceptablePriceCardsMsg(acceptablePriceCards);
    await sendMessage(bot, msg);
};

(async () => {
    try {
        const cardsData = await fetchCards();
        await sendMessageIfPriceIsAcceptable(cardsData);

        if (currentHours > 9 && currentHours < 11) {
            const msg = getCardsMsg(cardsData);
            await sendMessage(bot, msg);
        }
    } catch (error) {
        await sendMessage(bot, `Error fetching cards: ${error}`);
    }

    await sendMessage(bot, `Hours: ${currentHours}`);
})();
