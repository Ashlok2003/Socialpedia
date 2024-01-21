/* eslint-disable no-unused-vars */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "./authSlice";

//* This unit is responsible for login & Refreshing Token functionality... :)

const baseQuery = fetchBaseQuery({
<<<<<<< HEAD

    baseUrl: 'http://localhost:3000/users',
    credentials: 'include',

    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
=======
  baseUrl: "https://d5vml3-8000.csb.app/users",
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    console.log(getState().auth);

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
>>>>>>> 2bfbf886d8e0cef540741239a5bf03e950e957d2
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  console.log("Result : ", result);

<<<<<<< HEAD
    //! Since the access token expires then try to refresh the token... :)

    if (result?.error?.originalStatus === 403) {
        
=======
  //! Since the access token expires then try to refresh the token... :)

  if (result?.error?.originalStatus === 403) {
    console.log("Sending Refresh Token");

    const refreshResult = await baseQuery("/refresh", api, extraOptions);
>>>>>>> 2bfbf886d8e0cef540741239a5bf03e950e957d2

    if (refreshResult?.data) {
      const userData = api.getState().auth.userdata;

      api.dispatch(
        setCredentials({ userData, accessToken: refreshResult.accessToken }),
      );

<<<<<<< HEAD
            api.dispatch(setCredentials({ userData, accessToken: refreshResult.accessToken }));

            result = await baseQuery(args, api, extraOptions);
        }
        else {
            api.dispatch(logOut())
        }
=======
      result = await baseQuery(args, api, extraOptions);
      console.log(result);
    } else {
      api.dispatch(logOut());
>>>>>>> 2bfbf886d8e0cef540741239a5bf03e950e957d2
    }
  }

  return result;
};

export const apiSliceUser = createApi({
<<<<<<< HEAD
    reducerPath: 'user',
    baseQuery: baseQueryWithReauth,
    tagTypes: ["users"],
    endpoints: builder => ({
    })
})
=======
  baseQuery: baseQueryWithReauth,
  tagTypes: ["users"],
  endpoints: (builder) => ({}),
});
>>>>>>> 2bfbf886d8e0cef540741239a5bf03e950e957d2
