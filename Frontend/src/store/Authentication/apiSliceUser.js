/* eslint-disable no-unused-vars */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "./authSlice";

import configuration from "../../config/configuration";
const BASE_URL = configuration.SERVER_URL;

//* This unit is responsible for login & Refreshing Token functionality... :)

const baseQuery = fetchBaseQuery({


  baseUrl: `${BASE_URL}/users`,
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);


  //! Since the access token expires then try to refresh the token... :)

  if (result?.error?.originalStatus === 403) {


    //! Since the access token expires then try to refresh the token... :)

    if (result?.error?.originalStatus === 403) {
      console.log("Sending Refresh Token");

      const refreshResult = await baseQuery("/refresh", api, extraOptions);


      if (refreshResult?.data) {
        const userData = api.getState().auth.userdata;

        api.dispatch(
          setCredentials({ userData, accessToken: refreshResult.accessToken }),
        );

        api.dispatch(setCredentials({ userData, accessToken: refreshResult.accessToken }));

        result = await baseQuery(args, api, extraOptions);
      }
      else {
        api.dispatch(logOut())
      }
    }
  }

  return result;
};

export const apiSliceUser = createApi({
  reducerPath: 'user',
  baseQuery: baseQueryWithReauth,
  tagTypes: ["users"],
  endpoints: builder => ({
  })
})
