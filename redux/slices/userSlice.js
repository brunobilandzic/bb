import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "userState",
  initialState: initialUserState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
