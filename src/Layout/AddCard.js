import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams, useRouteMatch, useLocation, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDeck,
    addCard,
    selectDeck,
    selectDeckLoading,
    selectDeckError
} from './deck.slice';
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

export default function AddCard() {
    console.log('AddCard routeMatchOutput', useRouteMatch());
    const deck = useSelector(selectDeck); //get redux deck slice in state
    const { deckId } = useParams(); //the deck id
    console.log('deckId', deckId);
    /*
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const handleFrontChange = (event) => setFront(event.target.value);
    const handleBackChange = (event) => setBack(event.target.value);
    */
    const loading = useSelector(selectDeckLoading);
    const error = useSelector(selectDeckError);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    console.log('location:', location);

    /* Adding this in per requirement:
    You must use the readDeck() function from src/utils/api/index.js to load the deck that you're adding the card to.
    */
    useEffect(() => { //get redux deck slice in state
        async function loadDeck(id) {
          await dispatch(fetchDeck(id));
        }
        loadDeck(deckId);
    }, [dispatch]);
    
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

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Submitted: ", formData.front, formData.back);
        async function createCard() {
            const deckId = deck.id;
            console.log("Submitting: ", deckId, formData.front, formData.back);
            const front = formData.front;
            const back = formData.back;
            const payload = {deckId, front, back}; //package payload parameters
            const response = await dispatch(addCard(payload));
            console.log('AddCard response.payload.id:', response.payload.id);
            setFormData({ ...initialFormState });
            history.push(location);
        }
        createCard();
    }

    function handleCancel() {
        history.push(`/decks/${deck.id}`);
        //<Redirect to="/"/>
    }

    let render;
    if (loading) { //while loading data from API
        render = <Loading />;
    } else if (error) { //if error
        render = <ErrorMessage error={error} />;
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
    }

    return (<>{render}</>);
}
