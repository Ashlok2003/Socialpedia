import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./Posts/postSlice";
import userSlice from "./Users/userSlice";
import { apiSlice } from "./Posts/apiSlice";
import { apiSliceUser } from "./Authentication/apiSliceUser";
import authReducer from "./Authentication/authSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [apiSliceUser.reducerPath]: apiSliceUser.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware).concat(apiSliceUser.middleware),
    devTools: true,
});
