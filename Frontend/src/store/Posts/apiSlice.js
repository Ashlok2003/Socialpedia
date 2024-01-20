import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://d5vml3-8000.csb.app" }),
  tagTypes: ["POST"],
  endpoints: (builder) => ({}),
});
