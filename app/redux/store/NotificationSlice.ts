
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// // import { fetchNotifications } from "@/components/comment/action";

// interface Notification {
//   id: number;
//   userId: number;
//   userGetReplyId: number;
//   bookId: number;
//   isRead: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   user: {
//     id: number;
//     name: string;
//     avatar: string;
//   };
//   userGetReply: {
//     id: number;
//     name: string;
//   };
// }

// const notificationsSlice = createSlice({
//   name: "notifications",
//   initialState: [] as Notification[],
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
//       return action.payload;
//     });
//   },
// });

// export default notificationsSlice.reducer;

