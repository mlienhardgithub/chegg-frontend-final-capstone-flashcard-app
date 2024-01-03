import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams, useRouteMatch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDeck,
    selectDeck,
    selectDeckLoading,
    selectDeckError
} from './deck.slice';
import {
    fetchCard, editCard, selectCard, selectCardLoading, selectCardError
} from './card.slice';
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

export default function EditCard() {
    console.log('EditCard routeMatchOutput', useRouteMatch());
    const deck = useSelector(selectDeck); //get redux deck slice in state
    const card = useSelector(selectCard); //get redux deck slice in state
    const { deckId } = useParams(); //the deck id
    console.log('deckId', deckId);
    const { cardId } = useParams(); //the card id
    console.log('cardId', cardId);
    
    const loadingDeck = useSelector(selectDeckLoading);
    const errorDeck = useSelector(selectDeckError);
    const loadingCard = useSelector(selectCardLoading);
    const errorCard = useSelector(selectCardError);
    const dispatch = useDispatch();
    const history = useHistory();

    /* Adding this in per requirement:
    You must use the readDeck() function from src/utils/api/index.js to load the deck that contains the card to be edited.
    */
    useEffect(() => { //get redux deck slice in state
        async function loadDeck(id) {
          await dispatch(fetchDeck(id));
        }
        loadDeck(deckId);
    }, [dispatch]);

    //const deck = decks.find((deck) => Number(deckId) === Number(deck.id));
    console.log('deck:', deck);

    /* Adding this in per requirement:
    Additionally, you must use the readCard() function from src/utils/api/index.js to load the card that you want to edit.
    */

    useEffect(() => { //get redux deck slice in state
        async function loadCard(id) {
          await dispatch(fetchCard(id));
        }
        loadCard(cardId);
    }, [dispatch]);

    //using this because the data is accurate and faster than using the API calls
    //const deckCard = deck.cards.find((card) => Number(cardId) === Number(card.id));
    //console.log('EditCard deckCard:', deckCard);
    console.log('EditCard card:', card);

    //using the card from the deck, because the API call takes to long to load, and only intermittenly updates the default values
    /*
    const [front, setFront] = useState((deckCard === undefined) ? card.front : deckCard.front);
    const [back, setBack] = useState((deckCard === undefined) ? card.back : deckCard.back);
    const handleFrontChange = (event) => setFront(event.target.value);
    const handleBackChange = (event) => setBack(event.target.value);
    */

    const initialFormState = {
        front: card?.front || '',
        back: card?.back || ''
    };
    const [formData, setFormData] = useState({ ...initialFormState });

    useEffect(() => {
        if (card) {
            setFormData({ ...initialFormState });
        }
    }, [card])

    console.log('front:', formData.front);
    console.log('back:', formData.back);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    /* test with
    curl -X PUT --data "front=junk&back=trash&deckId=3" http://localhost:8080/cards/19
    */
    function handleSubmit(event) {
        event.preventDefault();
        async function updateCard(deckId, id) {
            console.log("Submitting: ", id, formData.front, formData.back);
            const front = formData.front;
            const back = formData.back;
            const payload = {deckId, id, front, back}; //package payload parameters
            const response = await dispatch(editCard(payload));
            console.log('EditCard response.payload.id:', response.payload.id);
            history.push(`/decks/${deck.id}`);
        }
        updateCard(deck.id, cardId);
    }

    function handleCancel() {
        history.push(`/decks/${deck.id}`);
    }

    let render;
    if (loadingDeck || loadingCard) { //while loading data from API
        render = <Loading />;
    } else if (errorDeck || errorCard) { //if error
        if (errorDeck) {
            render = <ErrorMessage error={errorDeck} />;
        } else {
            render = <ErrorMessage error={errorCard} />;
        }
    } else {
        if (deck.id) { //if a deck is returned
            render = (
                <>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <i className="bi bi-house-fill"></i>
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to={`/decks/${deck.id}`}>Deck {deck.name}</Link>
                            </li>
                            <li
                                className="breadcrumb-item active" 
                                aria-current="page">
                                Edit Card {cardId}
                            </li>
                        </ol>
                    </nav>
                    <h2 className="card-title">
                        {deck.name}: Edit Card
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                        <label htmlFor="front">Front: </label>
                        <textarea
                            id="front"
                            type="text"
                            name="front"
                            onChange={handleChange}
                            placeholder="Front side of card"
                            value={formData.front}
                            required={true}
                            rows={3}
                            className="form-control" 
                        />
                        </div>
                        <div className="form-group">
                        <label htmlFor="back">Back: </label>
                        <textarea
                            id="back"
                            type="text"
                            name="back"
                            onChange={handleChange}
                            placeholder="Back side of card"
                            value={formData.back}
                            required={true}
                            rows={3}
                            className="form-control" 
                        />
                        </div>
                        <div className="btn-group" role="group">
                        <button type="reset" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
                        &nbsp;
                        <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </>
            );
        } else { //if no deck is found
            render = <Loading />;
        }
    }

    return (<>{render}</>);
}
