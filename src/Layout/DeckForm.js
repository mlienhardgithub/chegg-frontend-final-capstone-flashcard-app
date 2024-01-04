import React from "react";

export default function DeckForm({
    name, description,
    handleSubmit, handleChange, handleCancel
}) {
  return (
    <>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="name">Name: </label>
            <input
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Deck Name"
                value={name}
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
                value={description}
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
}
