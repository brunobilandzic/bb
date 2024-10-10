import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      console.log(action);
      state.items = action.payload;
    },
    addPost: (state, action) => {
      console.log("in add post action, payload:", action.payload);
      if (!state.items) {
        state.items = [];
      }
      state.items.unshift(action.payload);
    },
  },
});

export const { setPosts, addPost } = postsSlice.actions;

export default postsSlice.reducer;
