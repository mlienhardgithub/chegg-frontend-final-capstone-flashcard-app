import { configureStore } from '@reduxjs/toolkit';
import decksReducer from '../Layout/decks.slice';
import deckReducer from '../Layout/deck.slice';
import cardsReducer from '../Layout/cards.slice';
import cardReducer from '../Layout/card.slice';

export default configureStore({
  reducer: {
    decks: decksReducer,
    deck: deckReducer,
    cards: cardsReducer,
    card: cardReducer
  },
});