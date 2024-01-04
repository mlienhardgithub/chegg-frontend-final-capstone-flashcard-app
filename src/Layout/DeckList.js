import React from "react";
import { useRouteMatch } from "react-router-dom"; 

import NotFound from "./NotFound";
import DeckItem from "./DeckItem";

export default function DeckList({decks}) {
    console.log('routeMatchOutput', useRouteMatch());
    
    let render;
        let deckLength;
        if ((!Array.isArray(decks)) || (!decks.length)) {
            deckLength = 0;
        } else {
            deckLength = decks.length;
        }
        console.log('deckLength', deckLength);
    
        /* if there are no decks then do not display anything */
        if (deckLength > 0) {
            const list = decks.map((deck) => <DeckItem key={deck.id} deck={deck} />);
            render =  (
                <section className="card-row">
                    {list}
                </section>
            );
        } else {
            console.log('Not Found...');
            render = (
                <>
                    <div className="card">
                        <div className="card-body">
                            <NotFound />
                        </div>
                    </div>
                </>
            );
        }

    return (<>{render}</>);
}
