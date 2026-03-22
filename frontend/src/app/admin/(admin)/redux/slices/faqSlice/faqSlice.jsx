// redux/slices/faqSlice/faqSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

/* ============================
   GET ALL FAQs
============================ */
export const getAllFAQs = createAsyncThunk(
  "faqs/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/faqs`
      );
      
      if (!res.ok) {
        throw new Error("Failed to fetch FAQs");
      }
      
      const data = await res.json();
      // console.log(data.data)
      return data.data;
    } catch (err) {
      toast.error(err.message || "Failed to fetch FAQs");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   CREATE FAQ
============================ */
export const createFAQ = createAsyncThunk(
  "faqs/create",
  async (faqData, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/faqs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // credentials: "include",
          body: JSON.stringify(faqData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create FAQ");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "FAQ created successfully");
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   UPDATE FAQ
============================ */
export const updateFAQ = createAsyncThunk(
  "faqs/update",
  async ({ id, faqData }, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/faqs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // credentials: "include",
          body: JSON.stringify(faqData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update FAQ");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "FAQ updated successfully");
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   DELETE FAQ
============================ */
export const deleteFAQ = createAsyncThunk(
  "faqs/delete",
  async (faqId, thunkAPI) => {
    try {
                     const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/faqs/${faqId}`,
        {
          method: "DELETE",
          // credentials: "include",
           headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete FAQ");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "FAQ deleted successfully");
      thunkAPI.dispatch(getAllFAQs());
      return faqId;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const faqSlice = createSlice({
  name: "faqs",
  initialState: {
    faqData: [],
    loading: false,
    error: null,
    currentFAQ: null,
  },
  reducers: {
    setCurrentFAQ: (state, action) => {
      state.currentFAQ = action.payload;
    },
    clearCurrentFAQ: (state) => {
      state.currentFAQ = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL FAQs
      .addCase(getAllFAQs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFAQs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqData = action.payload;
      })
      .addCase(getAllFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE FAQ
      .addCase(createFAQ.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.faqData.unshift(action.payload);
      })
      .addCase(createFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE FAQ
      .addCase(updateFAQ.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFAQ.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.faqData.findIndex(faq => faq.id === action.payload.id);
        if (index !== -1) {
          state.faqData[index] = action.payload;
        }
      })
      .addCase(updateFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE FAQ
      .addCase(deleteFAQ.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.faqData = state.faqData.filter(faq => faq.id !== action.payload);
      })
      .addCase(deleteFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentFAQ, clearCurrentFAQ } = faqSlice.actions;
export default faqSlice.reducer;