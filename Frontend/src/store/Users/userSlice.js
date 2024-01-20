/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    currentUser: null,
    otherUsers: [],

    currentUsersLoading: false,
    otherUsersLoading: false,

    errors: null
}

const USERS_URL = 'http://localhost:3000/users';

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

export const loginUser = createAsyncThunk('/user/loginUser', async (userData) => {
    try {
        const response = await axios.post(`${USERS_URL}/login`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.userData._doc;
    } catch (error) {
        throw error;
    }
});


export const logoutUser = createAsyncThunk('/user/logoutUser', async (userData) => {
    try {
        await axios.get(`${USERS_URL}/logout`);
        return null;
    } catch (error) {
        throw error;
    }
});

export const fetchAllUsers = createAsyncThunk('/user/fetchAllUsers', async () => {
    try {
        const response = await axios.get(`${USERS_URL}/fetchallusers`);
        console.log("Fetch all users : ", response.data);
        return response.data;

    } catch (error) {
        throw error;
    }
});


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
            .addCase(loginUser.fulfilled, (state, action) => {
                state.currentUsersLoading = false;
                state.currentUser = action.payload;
                state.errors = null;
            })
            .addCase(loginUser.pending, (state) => {
                state.currentUsersLoading = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.currentUsersLoading = false;
                state.errors = action.error.message;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.currentUser = null;
                state.currentUsersLoading = false;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.otherUsers = action.payload;
                state.otherUsersLoading = false;
            })
            .addCase(fetchAllUsers.pending, (state, action) => {
                state.otherUsersLoading = true;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.otherUsers = [];
                state.otherUsersLoading = false;
            })
    }
});

export const { login, logout } = userSlice.actions;

export const currentUserDetails = (state) => state.user.currentUser;
export const allUsersDetails = (state) => state.user.otherUsers;

export default userSlice.reducer;