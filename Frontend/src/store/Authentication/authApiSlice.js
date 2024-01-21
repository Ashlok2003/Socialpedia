import { apiSliceUser } from "./apiSliceUser";

export const authApiSlice = apiSliceUser.injectEndpoints({
    endpoints: builder => ({

        login: builder.mutation({

            query: credentials => {
                
                return {
                    url: '/login',
                    method: 'POST',
                    body: { ...credentials },
                }
            }

        }),
        invalidatesTags: ["users"],
    })
})

export const { useLoginMutation } = authApiSlice;