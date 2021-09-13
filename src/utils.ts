import axios from 'axios';
import { CardsResponse } from './types';

export const fetchCards = async () => {
    const { data } = await axios.get<CardsResponse>(
        'http://localhost:3000/prices'
    );
    return data;
};
