import React from "react";
import { useParams, useRouteMatch } from "react-router-dom";
import CardItem from "./CardItem";

export default function CardList({deck}) {
    const { deckId } = useParams(); //the deck id
    console.log('CardList deckId', deckId);
    console.log('CardList routeMatchOutput', useRouteMatch());
    console.log('CardList deck:', deck);

    let cardLength;
    if ((!Array.isArray(deck.cards)) || (!deck.cards.length)) {
        cardLength = 0;
    } else {
        cardLength = deck.cards.length;
    }
    console.log('cards.length', cardLength);

    /* if there are no cards then do not display anything */
    if (cardLength > 0) {
        const list = deck.cards.map((card) => <CardItem key={card.id} deckId={deckId} card={card} />);
        return (
            <section className="card-row">
                {list}
            </section>
        );
    } else {
        return (<></>);
    }
}
