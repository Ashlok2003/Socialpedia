/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import configuration from '../../config/configuration';

const initialState = {
    currentUser: null,
    currentUsersLoading: false,
    otherUsersLoading: false,

    errors: null
}
const BASE_URL = configuration.SERVER_URL;
const USERS_URL = `${BASE_URL}/users`;

export const registerUser = createAsyncThunk('/user/registerUser', async (userData) => {
    try {
        const response = await axios.post(`${USERS_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data._doc;
    } catch (error) {
        throw error;
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = action.payload;
            state.currentUsersStatus = true;
        },
        logout: (state, action) => {
            state.currentUser = null;
            state.currentUsersStatus = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action) => {

            })

    }
});

export const { login, logout } = userSlice.actions;

export const currentUserDetails = (state) => state.user.currentUser;
export const allUsersDetails = (state) => state.user.otherUsers;

export default userSlice.reducer;