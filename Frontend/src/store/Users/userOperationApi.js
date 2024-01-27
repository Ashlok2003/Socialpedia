import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import configuration from "../../config/configuration";

const BASE_URL = configuration.SERVER_URL;

export const userOperationApi = createApi({
    reducerPath: 'userOperation',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({})
});