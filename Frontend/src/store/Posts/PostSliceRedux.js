/* eslint-disable no-unused-vars */

import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";


const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
    selectId: post => post.postId
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({

        getPosts: builder.query({
            query: () => '/post/getallposts',

            transformResponse: (responseData) => {
                const postsWithComments = responseData.map(post => ({
                    ...post,
                    imagePath: `http://localhost:3000/${post.imagePath}`,
                }));

                const normalisedData = postsAdapter.setAll(initialState, postsWithComments);

                return normalisedData;

            },

            providesTags: (result, error, arg) => {

                return [
                    { types: 'POST', id: 'LIST' },
                    ...result.ids.map(post => ({ type: 'POST', id: post.postId }))
                ]
            }

        }),

        getPostsByUserId: builder.query({
            query: (postId) => `/post/getPostById/${postId}`,

            providesTags: (result, error, arg) => {

                return [
                    ...result.ids.map(
                        id => ({ type: 'POST', id }))
                ]
            }

        }),

        addNewPost: builder.mutation({

            query: (initialPost) => ({
                url: '/post/addnewpost',
                method: 'POST',
                body: initialPost,
            }),

            async onQueryStarted(newPostData, { dispatch, queryFulfilled }) {

                const newPost = {
                    _id: "temp_id",
                    userId: newPostData.get('userId'),
                    postId: newPostData.get('postId'),
                    title: newPostData.get('title'),
                    description: newPostData.get('description'),
                    isImage: newPostData.get('postImage') ? true : false,
                    imagePath: newPostData.get('postImage') ? newPostData.get('postImage').path : '',
                    likes: [],
                    comments: [],
                    createdAt: new Date().toISOString(),
                }

                const readFile = (file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                }

                if (newPost.isImage) {
                    const file = newPostData.get('postImage');
                    const imagePath = await readFile(file);
                    newPost.imagePath = imagePath;
                }

                const optimisticUpdate = extendedApiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
                    draft.entities[newPost.postId] = newPost;
                    draft.ids.unshift(newPost.postId);
                });

                const patchResult = dispatch(optimisticUpdate);

                try {
                    await queryFulfilled;

                } catch (error) {
                    if (error.error?.data !== 'OK') {
                        patchResult.undo();
                        console.log("Erro Encountered !", error);
                    }
                }

            },

            invalidatesTags: (result, error, arg) => {
                return [
                    { type: 'POST', id: 'LIST' }
                ]
            }
        }),

        updatePost: builder.mutation({

            query: initialState => ({
                url: `/post/updatepost/${initialState.postId}`,
                method: 'PATCH',
                body: JSON.stringify(initialState)
            }),

            invalidatesTags: (result, error, arg) => {
                console.log("Updated Post Args ", arg);
                return [
                    { type: 'POST', id: arg.id }
                ]
            }
        }),

        deletePost: builder.mutation({
            query: ({ id }) => ({
                url: `/post/removepost/${id}`,
                method: 'DELETE'
            }),

            async onQueryStarted({ id }, { dispatch, queryFulfilled }) {


                const optimisticUpdate = extendedApiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
                    delete draft.entities[id];
                    draft.ids = draft.ids.filter(item => item !== id);
                });

                const patchResult = dispatch(optimisticUpdate);

                try {
                    await queryFulfilled;
                } catch (error) {
                    if (error.error?.data !== 'OK') {
                        patchResult.undo();
                        console.log("Error Encountered!", error);
                    }
                }
            },

            invalidatesTags: (result, error, arg) => [
                { type: 'POST', id: arg.id }
            ]
        }),

        addReaction: builder.mutation({
            query: ({ postId, userId }) => ({
                url: `/post/likes/${postId}`,
                method: 'PUT',
                body: { userId }
            }),

            async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, draft => {

                        if (draft.entities[postId].likes.includes(userId)) {
                            draft.entities[postId].likes = draft.entities[postId].likes.filter(x => x !== userId);
                        } else {
                            draft.entities[postId].likes.push(userId);
                        }
                    })
                )

                try {
                    await queryFulfilled;
                } catch (error) {

                    if (error && error?.error?.data !== 'OK') {
                        patchResult.undo();
                        console.log(error);
                    }
                }
            }
        }),


        addComment: builder.mutation({

            query: ({ postId, userId, username, userImage, text }) => ({
                url: `/post/addcomment/${postId}`,
                method: 'POST',
                body: { userId, username, userImage, text },
            }),

            async onQueryStarted({ postId, userId, username, userImage, text }, { dispatch, queryFulfilled }) {

                const postCommentsResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, (draft) => {

                        const post = draft.entities[postId];

                        if (post) {
                            post.comments = [...post.comments, { userId, user: username, userImage, text }];
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {

                    if (error && error?.error?.data !== 'OK') {
                        postCommentsResult.undo();
                        console.log(error);
                    }
                }
            },
        }),
    })
});

export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation,
    useAddCommentMutation,
} = extendedApiSlice;

export const selectPostRequest = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
    selectPostRequest,
    postResult => postResult?.data
)

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);