import { configureStore } from "@reduxjs/toolkit";
import postSlice from "./Posts/postSlice";
import userSlice from "./Users/userSlice";
import { apiSlice } from "./Posts/apiSlice";
import { apiSliceUser } from "./Authentication/apiSliceUser";
import { userOperationApi } from "./Users/userOperationApi";
import authReducer from "./Authentication/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [apiSliceUser.reducerPath]: apiSliceUser.reducer,
        [userOperationApi.reducerPath]: userOperationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware).concat(apiSliceUser.middleware).concat(userOperationApi.middleware),
    devTools: false,
});
