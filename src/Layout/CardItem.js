import React from "react";
import { useDispatch } from 'react-redux';
import { NavLink, useHistory, useParams, useRouteMatch } from "react-router-dom";
import { removeCard } from './deck.slice';

export default function CardItem({deckId, card}) { //props passed down from DeckList
    console.log('CardItem routeMatchOutput', useRouteMatch());
    const { cardId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleDelete = async (id) => {
        const result = window.confirm("Delete this card? \nYou will not be able to recover it.");
        if (result) {
            async function remove() {
                const response = await dispatch(removeCard(id));
                console.log('DeckItem delete response:', response);
                history.go(0); // re-render the page
            };
            remove();
        }
    };
    
    return (
        <div className="card">
            <div className="card-body">
                <p>{card.front}</p>
                <p>{card.back}</p>
                <div className="btn-group" role="group">
                    <NavLink to={`/decks/${deckId}/cards/${card.id}/edit`}>
                        <button className="btn btn-secondary">
                            <i className="bi bi-pencil-fill"></i> Edit
                        </button>
                    </NavLink>
                    &nbsp;
                    <button
                        onClick={() => handleDelete(card.id)}
                        className="btn btn-danger"
                        >
                        <i className="bi bi-trash3-fill"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
