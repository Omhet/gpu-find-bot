export type CardsResponse = Record<string, CardResponse>;

export type CardResponse = {
    cards: Card[];
    stats: Stats;
};

export type Stats = {
    min: Card;
    med: Card;
    max: Card;
};

export type Shop = {
    name: string;
    link: string;
};

export type Card = {
    name: string;
    shop: Shop;
    price: number;
};
