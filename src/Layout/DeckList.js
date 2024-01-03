import React, { useEffect } from 'react';
import { useRouteMatch } from "react-router-dom"; 
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDecks,
  selectAllDecks,
  selectLoading,
  selectError
} from './decks.slice';
import ErrorMessage from "./ErrorMessage";
import Loading from './Loading';
import NotFound from "./NotFound";
import DeckItem from "./DeckItem";

export default function DeckList() {
    console.log('routeMatchOutput', useRouteMatch());
    const decks = useSelector(selectAllDecks); //get redux slice of decks in state
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const dispatch = useDispatch();

    useEffect(() => { //get redux slice of decks in state
        async function loadDecks() {
          await dispatch(fetchDecks());
        }
        loadDecks();
    }, [dispatch]);
    
    let render;
    if (loading) { //while loading data from API
        render = <Loading />;
    } else if (error) { //if error
        render = <ErrorMessage error={error} />;
    } else {
        let deckLength;
        if ((!Array.isArray(decks)) || (!decks.length)) {
            deckLength = 0;
        } else {
            deckLength = decks.length;
        }
        console.log('decks.length', decks.length);
    
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
    }

    return (<>{render}</>);
}