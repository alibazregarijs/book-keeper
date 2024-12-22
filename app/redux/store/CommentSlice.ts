import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CommentState = {
  showComments: boolean;
  bookId: string;
  userId : string
};

const initialState: CommentState = {
  showComments: false,
  bookId: '',
  userId: ''
};

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setCommentQuery(state, action: PayloadAction<{ bookId: string, userId: string , showComments: boolean }>) {
      state.bookId = action.payload.bookId;
      state.userId = action.payload.userId;
      state.showComments = true;


    },
    clearCommentQuery(state) {
      state.bookId = '';
      state.userId = '';
      state.showComments = false;
    },
  },
});

export const { setCommentQuery, clearCommentQuery } = commentSlice.actions;


