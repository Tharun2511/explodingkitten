import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./users/userSlice";
import gameSlice from "./game/gameSlice";

export const store = configureStore({
    reducer: {
        userState: userSlice,
        gameState: gameSlice
    }
});
