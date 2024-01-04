import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams, useRouteMatch, Redirect } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api/index";
import Loading from "./Loading";

export default function EditDeck() {
    console.log('routeMatchOutput', useRouteMatch());
    const [deck, setDeck] = useState({});
    const { deckId } = useParams(); //the deck id
    console.log('deckId', deckId);
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

    const initialFormState = {
        name: deck?.name || '',
        description: deck?.description || ''
    };
    const [formData, setFormData] = useState({ ...initialFormState });

    useEffect(() => {
        if (deck) {
            setFormData({ ...initialFormState });
        }
    }, [deck])

    console.log('name:', formData.name);
    console.log('description:', formData.description);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    function handleSubmit(event) {
        event.preventDefault();
        async function editDeck(id) {
            const abortController = new AbortController();
            try {
                console.log("Submitting: ", id, formData.name, formData.description);
                const name = formData.name;
                const description = formData.description;
                const payload = {id, name, description}; //package payload parameters
                const response = await updateDeck(payload, abortController.signal)
                console.log('EditDeck response.id:', response.id);
                history.push(`/decks/${response.id}`);
            } catch(error) {
                console.log('error:', error);
                abortController.abort(); // Cancels any pending request or response
            }
        }
        editDeck(deckId);
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
                                Edit Deck
                            </li>
                        </ol>
                    </nav>
                    <h2 className="card-title">
                        Edit Deck
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                        <label htmlFor="name">Name: </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            onChange={handleChange}
                            placeholder="Deck Name"
                            value={formData.name}
                            required={true}
                            className="form-control" 
                        />
                        </div>
                        <div className="form-group">
                        <label htmlFor="description">Description: </label>
                        <textarea
                            id="description"
                            type="text"
                            name="description"
                            onChange={handleChange}
                            placeholder="Brief description of the deck"
                            value={formData.description}
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
