import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    readCard, updateCard
} from "../utils/api";

export const fetchCard = createAsyncThunk(
    'card/fetchCard',
    async (id, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        try {
            const response = await readCard(id, abortController.signal)
            console.log('response:', response);
            return response;
        } catch(error) {
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

export const editCard = createAsyncThunk(
    'card/editCard',
    async (payload, thunkAPI) => {
        const abortController = new AbortController(); // Create a new `AbortController`
        const {deckId, id, front, back} = payload; //expand payload argument
        console.log('id', id, 'front', front, 'back', back);
        try {
            const response = await updateCard({deckId, id, front, back}, abortController.signal)
            console.log('response:', response);
            return response;
        } catch(error) {
            abortController.abort(); // Cancels any pending request or response
        }
    }
);

const initialState = {
    card: {},
    loading: false,
    error: false,
};

const options = {
    name: 'card',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchCard.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [fetchCard.fulfilled]: (state, action) => {
            console.log('action.payload:', action.payload);
            state.card = action.payload; //assign the deck into the state
            state.loading = false;
            state.error = false;
        },
        [fetchCard.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },
        
        [editCard.pending]: (state) => {
            state.loading = true;
            state.error = false;
        },
        [editCard.fulfilled]: (state, action) => {
            console.log('action.payload:', action.payload);
            state.card = action.payload; //assign the deck into the state
            state.loading = false;
            state.error = false;
            console.log('state.card:', state.card);
        },
        [editCard.rejected]: (state, action) => {
            state.loading = false;
            state.error = true;
        },
        
    },
};

const cardSlice = createSlice(options);

//export reducer functions


//export reducer
export default cardSlice.reducer;

//export selector to subscribe only to specific parts of the application state that they need for rendering
export const selectCard = (state) => state.card.card;
export const selectCardLoading = (state) => state.card.loading;
export const selectCardError = (state) => state.card.error;

