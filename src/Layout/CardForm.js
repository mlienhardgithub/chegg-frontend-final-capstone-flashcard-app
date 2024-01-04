import React from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";

export default function CardForm({
    title, cardId, deck, front, back,
    handleSubmit, handleChange, handleCancel
}) {
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
                            {title} {cardId}
                        </li>
                    </ol>
                </nav>
                <h2 className="card-title">
                    {deck.name}: {title}
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
                        value={front}
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
                        value={back}
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
