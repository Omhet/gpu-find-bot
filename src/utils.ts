import axios from 'axios';

export const fetchCardPrices = async () => {
    const { data } = await axios.get('http://localhost:3000/prices');
    return data;
};
