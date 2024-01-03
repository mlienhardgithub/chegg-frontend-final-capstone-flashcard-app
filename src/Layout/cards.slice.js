import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    listCardsByDeck
} from "../utils/api/index";

export const fetchCards = createAsyncThunk(
    'cards/fetchCards',
    async (deckId, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        try {
            console.log('cards.slice calling listCardsByDeck');
            const response = await listCardsByDeck(deckId, abortController.signal)
            console.log('cards.slice response:', response);
            return response;
        } catch(error) {
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

const initialState = {
    cards: [],
    loading: false,
    error: false,
};

const options = {
    name: 'cards',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchCards.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [fetchCards.fulfilled]: (state, action) => {
            console.log('action.payload:', action.payload);
            state.cards = action.payload; //assign the deck list into the state
            state.loading = false;
            state.error = false;
        },
        [fetchCards.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },

    },
};

const cardsSlice = createSlice(options);

//export reducer functions

//export reducer
export default cardsSlice.reducer;

//export selector to subscribe only to specific parts of the application state that they need for rendering
export const selectAllCards = (state) => state.cards.cards;
export const selectLoading = (state) => state.cards.loading;
export const selectError = (state) => state.cards.error;

