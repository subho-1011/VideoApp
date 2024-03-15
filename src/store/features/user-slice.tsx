import { createSlice } from "@reduxjs/toolkit";

interface Image {
    url: string;
    publicId: string;
}

interface User {
    username: string;
    password: string;
    fullname: string;
    email: string;
    avatar: Image;
    coverImage: Image;
    bio: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    loggedIn: boolean;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    loggedIn: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // set the initial state of the user
        setUser: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.loggedIn = false;
        },
        // initialize the user
        initUser: (state, action) => {
            state.user = action.payload;
        },
        // login the user
        loginUser: (state, action) => {
            state.user = action.payload;
        },
        // logout the user
        logoutUser: (state, action) => {
            state.user = null;
        },
        // set the loading state of the user
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // set the error state of the user
    },
});

export const { initUser } = userSlice.actions;

export default userSlice.reducer;
