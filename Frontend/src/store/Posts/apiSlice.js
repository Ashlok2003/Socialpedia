import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '../Authentication/authSlice';

export const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3000',

    credentials: 'include',

    prepareHeaders: (headers, { getState }) => {

        const token = getState().auth.accessToken;


        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
    }
});


export const baseQueryWithReauth = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.originalStatus === 403) {

        const refreshResult = await baseQuery('/users/refresh', api, extraOptions);

        if (refreshResult?.data) {

            const userData = api.getState().auth.userData;
            
            api.dispatch(setCredentials({ userData, accessToken: refreshResult.data.accessToken }));
            result = await baseQuery(args, api, extraOptions);
        }
        else {
            api.dispatch(logOut());
        }

    }

    return result;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['POST'],
    endpoints: (builder) => ({})
})
