import { configureStore } from "@reduxjs/toolkit";

import loadingReducer from "./slices/loadingSlice";
import userReducer from "./slices/userSlice";
import postsReducer from "./slices/postsSlice";

const store = configureStore({
  reducer: {
    loadingState: loadingReducer,
    userState: userReducer,
    postsState: postsReducer,
  },
});

export default store;
