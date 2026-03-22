// redux/slices/gallerySlice/gallerySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

/* ============================
   GET ALL GALLERY IMAGES
============================ */
export const getAllGallery = createAsyncThunk(
  "gallery/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/gallery`
      );
      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch gallery");
      }
// console.log(data, "from slice")
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   CREATE GALLERY IMAGE
============================ */
export const createGallery = createAsyncThunk(
  "gallery/create",
  async (formData, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/gallery`,
        {
          method: "POST",
          // credentials: "include",
           headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to upload image");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Image uploaded successfully");
      return data.data; // Returns full gallery array
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   DELETE GALLERY IMAGE
   Takes image path as parameter
============================ */
export const deleteGallery = createAsyncThunk(
  "gallery/delete",
  async (imagePath, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/gallery/${imagePath}`,
        {
          method: "DELETE",
           headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
          // credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete image");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Image deleted successfully");
      thunkAPI.dispatch(getAllGallery());
      return imagePath;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    galleryData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL GALLERY
      .addCase(getAllGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleryData = action.payload;
      })
      .addCase(getAllGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE GALLERY
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleryData = action.payload; // Update with full array returned from API
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE GALLERY
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gallerySlice.reducer;