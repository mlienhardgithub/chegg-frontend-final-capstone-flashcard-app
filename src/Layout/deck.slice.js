import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    readDeck, updateDeck, createCard, deleteCard
} from "../utils/api";

export const fetchDeck = createAsyncThunk(
    'deck/fetchDeck',
    async (deckId, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        try {
            console.log('deck.slice calling readDeck');
            const response = await readDeck(deckId, abortController.signal)
            console.log('deck.slice response:', response);
            return response;
        } catch(error) {
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

export const editDeck = createAsyncThunk(
    'deck/editDeck',
    async (payload, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        const {id, name, description} = payload; //expand payload argument
        console.log('id', id, 'name', name, 'description', description);
        try {
            const response = await updateDeck({id, name, description}, abortController.signal)
            console.log('response:', response);
            return response;
        } catch(error) {
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

export const addCard = createAsyncThunk(
    'deck/addCard',
    async (payload, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        const {deckId, front, back} = payload; //expand payload argument
        console.log('deckId', deckId, 'front', front, 'back', back);
        try {
            const response = await createCard(deckId, {front, back}, abortController.signal)
            console.log('response:', response);
            return response;
        } catch(error) {
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

export const removeCard = createAsyncThunk(
    'deck/removeCard',
    async (cardId, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        try {
            const response = await deleteCard(cardId, abortController.signal)
            console.log('response:', response);
            return response;
        } catch(error) {
            console.log('error:', error);
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

const initialState = {
    deck: {},
    loading: false,
    error: false,
};

const options = {
    name: 'deck',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchDeck.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [fetchDeck.fulfilled]: (state, action) => {
            console.log('action.payload:', action.payload);
            state.deck = action.payload; //assign the deck into the state
            state.loading = false;
            state.error = false;
        },
        [fetchDeck.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },

        [editDeck.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [editDeck.fulfilled]: (state, action) => {
            console.log('action.payload:', action.payload);
            state.deck = action.payload; //assign the deck into the state
            state.loading = false;
            state.error = false;
        },
        [editDeck.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },

        [addCard.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [addCard.fulfilled]: (state, action) => {
            console.log('action.payload:', action.payload);
            if ((!Array.isArray(state.deck.cards)) || (!state.deck.cards.length)) {
                state.deck.cards = [action.payload]; //initialize card list
            } else {
                state.deck.cards.push(action.payload); //push the new card into the list
            }
            state.loading = false;
            state.error = false;
        },
        [addCard.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },
        
        [removeCard.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [removeCard.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = false;
        },
        [removeCard.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },
    },
};

const deckSlice = createSlice(options);

//export reducer functions


//export reducer
export default deckSlice.reducer;

//export selector to subscribe only to specific parts of the application state that they need for rendering
export const selectDeck = (state) => state.deck.deck;
export const selectDeckLoading = (state) => state.deck.loading;
export const selectDeckError = (state) => state.deck.error;

