import React from 'react';
import { NavLink } from "react-router-dom";
import DeckList from "./DeckList";

export default function Home() {
  return (
    <>
      <NavLink className="mt-2" to="/decks/new">
        <button className="btn btn-secondary">
          <i className="bi bi-plus h5"></i>
          Create Deck
        </button>
      </NavLink>
      <DeckList />
    </>
  );
}
