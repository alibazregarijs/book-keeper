import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SeeCommentsState = {
  showComments: boolean;
};

const initialState: SeeCommentsState = {
  showComments: false,
};

export const seeCommentsSlice = createSlice({
  name: 'seeComments',
  initialState,
  reducers: {
    setSeeCommentsQuery(state, action: PayloadAction<{ showComments: boolean }>) {
      state.showComments = action.payload.showComments;
    },
    clearSeeCommentsQuery(state) {
      state.showComments = false;
    },
  },
});

export const { setSeeCommentsQuery, clearSeeCommentsQuery } = seeCommentsSlice.actions;