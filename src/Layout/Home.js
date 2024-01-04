import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { listDecks } from "../utils/api/index";
import DeckList from "./DeckList";

export default function Home() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
      setDecks([]);
      async function loadDecks() {
          const abortController = new AbortController();
          try {
              const response = await listDecks(abortController.signal)
              console.log('response:', response);
              setDecks(response);
          } catch(error) {
              console.log('error:', error);
              abortController.abort(); // Cancels any pending request or response
          }
      }
      loadDecks();
  }, []); // Passing [] so that it only runs the effect once

  return (
    <>
      <NavLink className="mt-2" to="/decks/new">
        <button className="btn btn-secondary">
          <i className="bi bi-plus h5"></i>
          Create Deck
        </button>
      </NavLink>
      <DeckList decks={decks} />
    </>
  );
}
