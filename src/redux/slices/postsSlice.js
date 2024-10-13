import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.items = action.payload;
    },
    addPost: (state, action) => {
      if (!state.items) {
        state.items = [];
      }
      state.items.unshift(action.payload);
    },
    newResponse: (state, action) => {
      state.items = state.items.map((post) => {
        if (post._id === action.payload.postId) {
          post.response = action.payload.response;
        }
        return post;
      });
    },
  },
});

export const { setPosts, addPost, newResponse } = postsSlice.actions;

export default postsSlice.reducer;