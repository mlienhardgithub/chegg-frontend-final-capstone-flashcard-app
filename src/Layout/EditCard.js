import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams, useRouteMatch, Redirect } from "react-router-dom";
import { readDeck, readCard, updateCard } from "../utils/api/index";
import Loading from "./Loading";

export default function EditCard() {
    console.log('EditCard routeMatchOutput', useRouteMatch());
    const [deck, setDeck] = useState({});
    const [card, setCard] = useState({});
    const { deckId } = useParams(); //the deck id
    console.log('deckId', deckId);
    const { cardId } = useParams(); //the card id
    console.log('cardId', cardId);
    const history = useHistory();

    /* Adding this in per requirement:
    You must use the readDeck() function from src/utils/api/index.js to load the deck that contains the card to be edited.
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

    //const deck = decks.find((deck) => Number(deckId) === Number(deck.id));
    console.log('deck:', deck);

    /* Adding this in per requirement:
    Additionally, you must use the readCard() function from src/utils/api/index.js to load the card that you want to edit.
    */
    useEffect(() => {
        setCard({});
        async function loadCard(id) {
            const abortController = new AbortController();
            try {
                const response = await readCard(id, abortController.signal)
                console.log('response:', response);
                setCard(response);
            } catch(error) {
                console.log('error:', error);
                abortController.abort(); // Cancels any pending request or response
            }
        }
        loadCard(cardId);
    }, []); // Passing [] so that it only runs the effect once

    console.log('card:', card);

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
        async function editCard(deckId, id) {
            const abortController = new AbortController();
            try {
                console.log("Submitting: ", id, formData.front, formData.back);
                const front = formData.front;
                const back = formData.back;
                const payload = {deckId, id, front, back}; //package payload parameters
                const response = await updateCard(payload, abortController.signal)
                console.log('EditCard response.id:', response.id);
                history.push(`/decks/${deck.id}`);
            } catch(error) {
                console.log('error:', error);
                abortController.abort(); // Cancels any pending request or response
            }
        }
        editCard(deck.id, cardId);
    }

    function handleCancel() {
        history.push(`/decks/${deck.id}`);
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

    return (<>{render}</>);
}
