import { configureStore } from '@reduxjs/toolkit'
import { commentSlice } from "./CommentSlice";
import { seeCommentsSlice } from './SeeCommentsSlice';

export const store = configureStore({
  reducer: {
    seeCommentsSlice: seeCommentsSlice.reducer,
    comment: commentSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
