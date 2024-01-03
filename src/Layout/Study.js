import React, { useEffect, useState } from "react";
import { Link, NavLink, useHistory, useParams, useRouteMatch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDeck,
    selectDeck,
    selectDeckLoading,
    selectDeckError
} from './deck.slice';
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

function Study() {
    const deck = useSelector(selectDeck); //get redux deck slice in state
    //console.log('decks:', decks);
    const { deckId } = useParams(); //the deck id
    //console.log('deckId:', deckId);
    const [cardId, setCardId] = useState(0); //the card id
    //console.log('cardId', cardId);
    const [front, setFront] = useState(true); //determines side of card to display
    //console.log('front', front);
    //console.log('routeMatchOutput', useRouteMatch());
    const { path, url } = useRouteMatch();
    //console.log('path:', path, 'url:', url);
    const loading = useSelector(selectDeckLoading);
    const error = useSelector(selectDeckError);
    const dispatch = useDispatch();
    const history = useHistory();
    //console.log('history:', history);

    /* Adding this in per requirement:
    You must use the readDeck() function from src/utils/api/index.js to load the deck that is being studied.
    */
    useEffect(() => { //get redux deck slice in state
        async function loadDeck(id) {
          await dispatch(fetchDeck(id));
        }
        loadDeck(deckId);
    }, [dispatch]);

    //console.log('deck:', deck);

    const handleNext = () => {
        setFront(true); //flip to the front side of the card
        if (cardId < deck.cards.length - 1) {
            setCardId((currentId) => currentId + 1); //get the next card
        } else {
            const result = window.confirm("Restart cards? \nClick 'cancel' to return to the home page.");
            if (result) {
                setCardId(0); // restart the card deck
            } else { // go home
                history.push("/");
                <Redirect to="/"/>
            }
        }
    };

    let render;
    if (loading) { //while loading data from API
        render = <Loading />;
    } else if (error) { //if error
        render = <ErrorMessage error={error} />;
    } else {
        if (deck.id) { //if a deck is returned
            let cardLength;
            if ((!Array.isArray(deck.cards)) || (!deck.cards.length)) {
                cardLength = 0;
            } else {
                cardLength = deck.cards.length;
            }
        
            let render2;
            if (cardLength <= 2) { //display not enough cards
                render2 = (
                    <article className="col-12 col-md-6 col-xl-3 my-2 align-self-stretch">
                        <div className="border p-4 h-100 d-flex flex-column">
                            <h3 className="flex-fill">
                            Not enough cards.
                            </h3>
                            <p className="flex-fill">
                            You need at least 3 cards to study. There are {cardLength} cards in this deck.
                            </p>
                        </div>
                        <NavLink className="mt-2" to={`/decks/${deck.id}/cards/new`}>
                            <button className="btn btn-primary">
                                <i className="bi bi-plus h5"></i>
                                Add Cards
                            </button>
                        </NavLink>
                    </article>
                );
            } else { //display each card
                render2 = (
                    <article className="card">
                        <div className="card-body">
                            <h5 className="card-subtitle">
                                Card {cardId + 1} of {cardLength}
                            </h5>
                            {(front === true) ? <p>{deck.cards[cardId].front}</p> : <p>{deck.cards[cardId].back}</p>}
                            <div className="btn-group" role="group">
                                <button onClick={() => setFront(!front)} className="btn btn-secondary">
                                    Flip
                                </button>
                                &nbsp;
                                {(front === false) ? <button onClick={handleNext} className="btn btn-primary">Next</button> : <></>}
                            </div>
                        </div>
                    </article>
                );
            }
        
            render = (
                <>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <i className="bi bi-house-fill"></i>
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">Study</li>
                        </ol>
                    </nav>
                    <h2 className="card-title">Study: {deck.name}</h2>
                    {render2}
                </>
            );
        } else { //if no deck is found
            render = <Loading />;
        }
    }
    
    return (<>{render}</>);
};

export default Study;
