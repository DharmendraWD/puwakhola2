// redux/slices/messageSlice/messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

/* ============================
   GET ALL MESSAGES
============================ */
export const getAllMessages = createAsyncThunk(
  "messages/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/clientmessage`
      );
      
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      
      const data = await res.json();
      
      // Handle response format: { success: true, message: "...", data: [...] }
      let messagesArray = [];
      
      if (Array.isArray(data)) {
        messagesArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        messagesArray = data.data;
      } else if (data.success && Array.isArray(data.data)) {
        messagesArray = data.data;
      } else {
        console.warn("Message API returned non-array format:", data);
        messagesArray = Object.values(data);
      }
      
      return messagesArray;
    } catch (err) {
      toast.error(err.message || "Failed to fetch messages");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   DELETE MESSAGE
============================ */
export const deleteMessage = createAsyncThunk(
  "messages/delete",
  async (messageId, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/clientmessage/${messageId}`,
        {
          method: "DELETE",
           headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete message");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Message deleted successfully");
      thunkAPI.dispatch(getAllMessages());
      return messageId;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messageData: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messageData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL MESSAGES
      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messageData = action.payload;
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE MESSAGE
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messageData = state.messageData.filter(
          message => message.id !== action.payload
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;