// redux/slices/otherSlice/otherSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

/* ============================
   GET OTHER SECTION DATA
============================ */
export const getOtherData = createAsyncThunk(
  "other/getData",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/other`
      );
      
      if (!res.ok) {
        throw new Error("Failed to fetch other section data");
      }
      
      const data = await res.json();
      
      // Handle response format: { success: true, data: [...] }
      let otherData = {};
      
      if (Array.isArray(data)) {
        otherData = data[0] || {};
      } else if (data.data && Array.isArray(data.data)) {
        otherData = data.data[0] || {};
      } else if (data.success && Array.isArray(data.data)) {
        otherData = data.data[0] || {};
      } else if (typeof data === 'object') {
        otherData = data;
      }
      
      return otherData;
    } catch (err) {
      toast.error(err.message || "Failed to fetch data");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   UPDATE OTHER SECTION
============================ */
export const updateOtherData = createAsyncThunk(
  "other/update",
  async (otherData, thunkAPI) => {
    try {

             const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/other`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // credentials: "include",
          body: JSON.stringify(otherData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update data");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Data updated successfully");
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const otherSlice = createSlice({
  name: "other",
  initialState: {
    otherData: {},
    loading: false,
    error: null,
  },
  reducers: {
    updateLocalOtherData: (state, action) => {
      state.otherData = { ...state.otherData, ...action.payload };
    },
    clearOtherData: (state) => {
      state.otherData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // GET OTHER DATA
      .addCase(getOtherData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOtherData.fulfilled, (state, action) => {
        state.loading = false;
        state.otherData = action.payload;
      })
      .addCase(getOtherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE OTHER DATA
      .addCase(updateOtherData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOtherData.fulfilled, (state, action) => {
        state.loading = false;
        state.otherData = action.payload;
      })
      .addCase(updateOtherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateLocalOtherData, clearOtherData } = otherSlice.actions;
export default otherSlice.reducer;