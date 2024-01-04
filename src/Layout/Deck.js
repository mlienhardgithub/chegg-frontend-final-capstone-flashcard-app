import React, { useEffect, useState } from "react";
import { Link, NavLink, useHistory, useParams, useRouteMatch } from "react-router-dom";
import { readDeck, deleteDeck } from "../utils/api/index";
import Loading from "./Loading";
import CardList from "./CardList";

export default function Deck() {
    const [deck, setDeck] = useState({});
    const { deckId } = useParams(); //the deck id
    console.log('Deck deckId', deckId);
    const { url, path } = useRouteMatch();
    console.log('Deck routeMatchOutput', useRouteMatch());
    const history = useHistory();

    /* Adding this in per requirement:
    You must use the readDeck() function from src/utils/api/index.js to load the existing deck.
    */
    useEffect(() => {
        setDeck({});
        async function loadDeck(id) {
            const abortController = new AbortController();
            try {
                const response = await readDeck(id, abortController.signal)
                console.log('response:', response);
                setDeck(response);
            } catch(error) {
                console.log('error:', error);
                abortController.abort(); // Cancels any pending request or response
            }
        }
        loadDeck(deckId);
    }, []); // Passing [] so that it only runs the effect once

    console.log('deck:', deck);
    
    function handleDelete(id) {
        const result = window.confirm("Delete this deck? \nYou will not be able to recover it.");
        if (result) {
            async function removeDeck() {
                const abortController = new AbortController();
                try {
                    const response = await deleteDeck(id, abortController.signal)
                    console.log('Deck delete response:', response);
                } catch(error) {
                    console.log('error:', error);
                    abortController.abort(); // Cancels any pending request or response
                }
            }
            removeDeck();
            history.push("/"); // go to home page
            history.go(0); // re-render the home page
        }
    }

    let render;
        if (deck.id) { //if a deck is returned
            render = (
                <>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <i className="bi bi-house-fill"></i>
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">{deck.name}</li>
                        </ol>
                    </nav>
                    <h4 className="card-subtitle">{deck.name}</h4>
                    <p>{deck.description}</p>
                    <div className="btn-group" role="group">
                        <NavLink to={`/decks/${deck.id}/edit`}>
                            <button className="btn btn-secondary">
                                <i className="bi bi-pencil-fill"></i> Edit
                            </button>
                        </NavLink>
                        &nbsp;
                        <NavLink to={`/decks/${deck.id}/study`}>
                            <button className="btn btn-primary">
                                <i className="bi bi-journal-bookmark-fill"></i> Study
                            </button>
                        </NavLink>
                        &nbsp;
                        <NavLink to={`/decks/${deck.id}/cards/new`}>
                            <button className="btn btn-primary">
                                <i className="bi bi-plus h5"></i>
                                Add Cards
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
                    <h2 className="card-title">Cards</h2>
                    <div>
                        <CardList deck={deck} />
                    </div>
                </>
            );
        } else { //if no deck is found
            render = <Loading />;
        }

    return (<>{render}</>);
};
