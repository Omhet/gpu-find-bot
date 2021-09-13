import axios from 'axios';
import config from './config';
import { CardsResponse } from './types';

export const fetchCards = async () => {
    const { data } = await axios.get<CardsResponse>(config.CARDS_API!);
    return data;
};
