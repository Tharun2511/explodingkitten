import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        firstname: "",
        lastname: "",
        email: "",
        gender: "",
        dob: "",
        prevGame: null,
        prevGameCompleted: true,
        numberOfWins: 0,
        numberOfGames: 0,
        token: "",
    },
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        userLogout: (state, action) => {
            state.user = {};
            localStorage.removeItem("user");
        },
        updateUser: (state, action) => {
            state.user= {
                ...state.user,
                prevGameCompleted: true,
                numberOfGames: state.user.numberOfGames + 1,
                numberOfWins: action.payload === "win" ? state.user.numberOfWins + 1 : state.user.numberOfWins,
            }
            localStorage.setItem("user", JSON.stringify(state.user));
        }
    },
});

export const { setUser, userLogout, updateUser } = userSlice.actions;
export default userSlice.reducer;
