import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from "react-router-dom";
import { removeDeck } from './decks.slice';
import Loading from "./Loading";

export default function DeckItem({deck}) { //props passed down from DeckList
    console.log('DeckItem deck.id', deck.id);
    //console.log('DeckItem routeMatchOutput', useRouteMatch());
    const dispatch = useDispatch();
    const history = useHistory();
    console.log('deck:', deck);

    function handleDelete(id) {
        const result = window.confirm("Delete this deck? \nYou will not be able to recover it.");
        if (result) {
            async function remove() {
                const response = await dispatch(removeDeck(id));
                console.log('DeckItem delete response:', response);
                history.go(0); // re-render the page
            };
            remove();
        }
    }

    if (deck.id) { //if a deck is returned
        return (
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">{deck.name}</h4>
                    &nbsp;{(deck.cards === undefined) ? 0 : deck.cards.length} cards
                    <p>{deck.description}</p>
                    <div>
                        <div className="btn-group" role="group">
                            <NavLink to={`/decks/${deck.id}`}>
                                <button className="btn btn-secondary">
                                    <i className="bi bi-eye-fill"></i> View
                                </button>
                            </NavLink>
                            &nbsp;
                            <NavLink to={`/decks/${deck.id}/study`}>
                                <button className="btn btn-primary">
                                    <i className="bi bi-journal-bookmark-fill"></i> Study
                                </button>
                            </NavLink>
                            &nbsp;
                            <button
                                onClick={() => handleDelete(deck.id)}
                                className="btn btn-danger"
                                >
                                <i className="bi bi-trash3-fill"></i> Delete
                            </button>
                        </div>
                        &nbsp;
                        
                    </div>
                </div>
            </div>
        );
    } else { //if no deck is found
        return <Loading />;
    }
};
