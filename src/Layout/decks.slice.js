import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    listDecks, createDeck, deleteDeck, createCard, deleteCard
} from "../utils/api/index";

export const fetchDecks = createAsyncThunk(
    'decks/fetchDecks',
    async (arg, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        try {
            const response = await listDecks(abortController.signal)
            console.log('response:', response);
            return response;
        } catch(error) {
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

export const addDeck = createAsyncThunk(
    'decks/addDeck',
    async (payload, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        const {name, description} = payload; //expand payload argument
        console.log('name', name, 'description', description);
        try {
            const response = await createDeck({name, description}, abortController.signal)
            console.log('response:', response);
            return response;
        } catch(error) {
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

export const removeDeck = createAsyncThunk(
    'decks/removeDeck',
    async (deckId, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        try {
            const response = await deleteDeck(deckId, abortController.signal)
            console.log('response:', response);
            return response;
        } catch(error) {
            console.log('error:', error);
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

const initialState = {
    decks: [],
    loading: false,
    error: false,
};

const options = {
    name: 'decks',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchDecks.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [fetchDecks.fulfilled]: (state, action) => {
            console.log('action.payload:', action.payload);
            state.decks = action.payload; //assign the deck list into the state
            state.loading = false;
            state.error = false;
        },
        [fetchDecks.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },

        [addDeck.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [addDeck.fulfilled]: (state, action) => {
            console.log('action.payload:', action.payload);
            if ((!Array.isArray(state.decks)) || (!state.decks.length)) {
                state.decks = [action.payload]; //initialize deck
            } else {
                state.decks.push(action.payload); //push the new deck into the list
            }
            state.loading = false;
            state.error = false;
        },
        [addDeck.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },

        [removeDeck.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [removeDeck.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = false;
        },
        [removeDeck.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },
    },
};

const decksSlice = createSlice(options);

//export reducer functions

//export reducer
export default decksSlice.reducer;

//export selector to subscribe only to specific parts of the application state that they need for rendering
export const selectAllDecks = (state) => state.decks.decks;
export const selectLoading = (state) => state.decks.loading;
export const selectError = (state) => state.decks.error;

