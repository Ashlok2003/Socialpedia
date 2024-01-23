import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { userOperationApi } from './userOperationApi';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

export const userApiSlice = userOperationApi.injectEndpoints({
    endpoints: (builder) => ({

        getUserById: builder.query({
            query: (userId) => `/users/fetchuserbyuserid/${userId}`,

            transformResponse: (response) => ({
                ...response,
                avatarImage: `${response.avatarImage}`
            }),

            providesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
        }),

        updateUserProfile: builder.mutation({

            query: ({ userId, profileData }) => ({
                url: `/users/handleUserUpdate/${userId}`,
                method: 'PATCH',
                body: profileData,
            }),

            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
        }),

        updateUserFollowing: builder.mutation({

            query: ({ id, userId, name, email, avatarImage }) => ({
                url: '/users/handleFollowing',
                method: 'POST',
                body: { id, userId }
            }),

            async onQueryStarted({ id, userId, name, email, avatarImage }, { dispatch, queryFulfilled }) {
                const result = dispatch(userOperationApi.util.updateQueryData('getUserById', id, (oldQueryData) => {

                    const existingFollowerIndex = oldQueryData?.followers?.findIndex(follower => follower.id === userId);
                    console.log("Redux User", existingFollowerIndex);

                    if (existingFollowerIndex !== -1) {
                        console.log("User Exists !");
                        console.log({
                            ...oldQueryData,
                            followers: [
                                ...oldQueryData.followers.slice(0, existingFollowerIndex),
                                ...oldQueryData.followers.slice(existingFollowerIndex + 1),
                            ],
                        })
                        return {
                            ...oldQueryData,
                            followers: [
                                ...oldQueryData.followers.slice(0, existingFollowerIndex),
                                ...oldQueryData.followers.slice(existingFollowerIndex + 1),
                            ],
                        };
                    } else {
                        console.log("User Don't Exists !");
                        console.log({
                            ...oldQueryData,
                            followers: [...(oldQueryData.followers || []), { id: userId, name, email, avatarImage }],
                        })
                        return {
                            ...oldQueryData,
                            followers: [...(oldQueryData.followers || []), { id: userId, name, email, avatarImage }],
                        };
                    }
                }));

                try {
                    await queryFulfilled;
                } catch (error) {
                    result.undo();
                    console.log(error);
                }

            },

            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
        }),
    })
});

export const {
    useGetUserByIdQuery,
    useUpdateUserProfileMutation,
    useUpdateUserFollowingMutation
} = userApiSlice;

export const selectUserRequest = userApiSlice.endpoints.getUserById.select();

const selectUserData = createSelector(
    selectUserRequest,
    (userRequest) => userRequest?.data,
);

export const {
    selectById: selectUserById,
} = usersAdapter.getSelectors((state) => selectUserData(state ?? initialState));
