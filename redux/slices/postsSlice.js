import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
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
      state.items.push(action.payload);
    },
  },
});

export const { setPosts, addPost } = postsSlice.actions;

export default postsSlice.reducer;
