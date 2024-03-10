import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    game: {
        _id: null,
        user: null,
        cards: [],
        status: "",
    }
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setGame: (state, action) => {
            state.game = action.payload;
            console.log(state.game);
            console.log(action.payload);
        },
        updateCards: (state, action) => {
            state.game.cards = [...action.payload];
        }
    },
});

export const { setGame, updateCards } = gameSlice.actions;
export default gameSlice.reducer;
