/* eslint-disable no-unused-vars */

//* This section will manage the state of authentication.... :)

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: { userData: null, accessToken: null },

    reducers: {

        setCredentials: (state, action) => {
            console.log("Store ", action.payload);
            const { userData, accessToken } = action.payload;
            state.userData = userData;
            state.accessToken = accessToken;
        },

        logOut: (state, action) => {
            state.userData = null;
            state.accessToken = null;
        }
    }
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = state => state.auth.userData;

export const selectCurrentToken = state => state.auth.accessToken;