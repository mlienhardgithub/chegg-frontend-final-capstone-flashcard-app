import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch, useLocation, Redirect } from "react-router-dom";
import { readDeck, createCard } from "../utils/api/index";
import CardForm from "./CardForm";

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

    return (
        <CardForm
            title={"Add Card"}
            cardId={''}
            deck={deck}
            front={formData.front}
            back={formData.back}
            handleSubmit={handleSubmit} 
            handleChange={handleChange}
            handleCancel={handleCancel}
        />
    );
}
