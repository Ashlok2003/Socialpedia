/* eslint-disable no-useless-catch */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    posts: [],
    errors: null,
    status: 'idle'
}

const POSTS_URL = 'http://localhost:3000/post';

export const getPosts = createAsyncThunk('/posts/getallposts', async () => {
    try {
        const response = await axios.get(`${POSTS_URL}/getallposts`);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
});


export const addNewPost = createAsyncThunk('/posts/addnewpost', async (postdata) => {
    try {
        const response = await axios.post(`${POSTS_URL}/addnewpost`, postdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;

    } catch (error) {
        throw error;
    }
});

export const updatePost = createAsyncThunk('/posts/updatepost', async ({ postId, updatedData }) => {
    try {
        const response = await axios.patch(`${POSTS_URL}/updatepost/${postId}`, updatedData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const deletePost = createAsyncThunk('/posts/deletepost', async (postId) => {
    try {
        await axios.delete(`${POSTS_URL}/removepost/${postId}`);
        return postId;
    } catch (error) {
        throw error;
    }
});

export const handleLike = createAsyncThunk('/posts/handleLike', async ({ postId, userId }) => {
    try {
        await axios.put(`${POSTS_URL}/likes/${postId}`, { userId })
        return { postId, userId };
    } catch (error) {
        throw error;
    }
});

export const addComment = createAsyncThunk('/posts/addcomment', async ({ postId, userId, text }) => {
    try {
        await axios.post(`${POSTS_URL}/addcomment/${postId}`, { userId, text });
        return postId;
    } catch (error) {
        throw error;
    }
});


const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(getPosts.pending, (state, action) => {
                state.status = 'loading';
            }) 
            .addCase(getPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.errors = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts.push(action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedPost = action.payload;
                state.posts = state.posts.map((post) => post._id === updatedPost._id ? updatedPost : post);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const deletedPostId = action.payload;
                state.posts = state.posts.filter((post) => post._id !== deletedPostId);
            })
            .addCase(handleLike.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const postId = action.payload;
                state.posts = state.posts.map((post) =>
                    post._id === postId && !post.likes.includes(userId) ? { ...post, likes: [...post.likes, userId] } : post
                );
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { postId, message } = action.meta.arg;

                state.posts = state.posts.map((post) =>
                    post._id === postId ? { ...post, comments: [...post.comments, message] } : post
                );
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = 'failed';
                state.errors = action.error.message;
            });
    }
});

export default postSlice.reducer;
