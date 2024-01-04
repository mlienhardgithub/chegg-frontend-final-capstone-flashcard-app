import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams, useRouteMatch, useLocation, Redirect } from "react-router-dom";
import { readDeck, createCard } from "../utils/api/index";
import Loading from "./Loading";

export default function AddCard() {
    console.log('AddCard routeMatchOutput', useRouteMatch());
    const [deck, setDeck] = useState({});
    const { deckId } = useParams(); //the deck id
    console.log('deckId', deckId);
    const history = useHistory();
    const location = useLocation();
    console.log('location:', location);

    /* Adding this in per requirement:
    You must use the readDeck() function from src/utils/api/index.js to load the deck that you're adding the card to.
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

    const initialFormState = {
        front: '',
        back: ''
    };
    const [formData, setFormData] = useState({ ...initialFormState });

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    /* test with
    curl -X POST --data "front=junk&back=trash&deckId=3" http://localhost:8080/cards
    */
    function handleSubmit(event) {
        event.preventDefault();
        async function addCard() {
            const abortController = new AbortController();
            try {
                const deckId = deck.id;
                console.log("Submitting: ", deckId, formData.front, formData.back);
                const front = formData.front;
                const back = formData.back;
                const response = await createCard(deckId, {front, back}, abortController.signal)
                console.log('AddCard response:', response);
            } catch(error) {
                console.log('error:', error);
                abortController.abort(); // Cancels any pending request or response
            }
        }
        addCard();
        setFormData({ ...initialFormState });
        history.push(location);
    }

    function handleCancel() {
        history.push(`/decks/${deck.id}`);
        //<Redirect to="/"/>
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
                                <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
                            </li>
                            <li
                                className="breadcrumb-item active" 
                                aria-current="page">
                                Add Card
                            </li>
                        </ol>
                    </nav>
                    <h2 className="card-title">
                        {deck.name}: Add Card
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
                        <button type="reset" onClick={handleCancel} className="btn btn-secondary">Done</button>
                        &nbsp;
                        <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                </>
            );
        } else { //if no deck is found
            render = <Loading />;
        }

    return (<>{render}</>);
}
