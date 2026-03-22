// redux/slices/aboutusSlice/aboutUsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

/* ============================
   1. GET ABOUT US DETAILS
============================ */
export const getAboutUs = createAsyncThunk(
  "aboutUs/get",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/aboutus`
      );
      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch About Us");
      }

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   2. UPDATE ABOUT US DETAILS
============================ */
export const editAboutUs = createAsyncThunk(
  "aboutUs/edit",
  async (formData, thunkAPI) => {
    try {
                         const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/aboutus`,
        {
          method: "PUT",
          // credentials: "include",
            headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update About Us");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "About Us updated");
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   3. GET ABOUT US IMAGES
============================ */
export const getAboutUsImages = createAsyncThunk(
  "aboutUs/images/get",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/aboutusimg`
      );
      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch images");
      }

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   4. CREATE/UPDATE ABOUT US IMAGE
   (Upload single image - firstCardImage OR fullImage)
============================ */
export const createAboutUsImage = createAsyncThunk(
  "aboutUs/images/create",
  async (formData, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/aboutusimg`,
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
      thunkAPI.dispatch(getAboutUsImages()); // Refresh images
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   5. DELETE ABOUT US IMAGE
   (Delete specific image by type)
============================ */
export const deleteAboutUsImage = createAsyncThunk(
  "aboutUs/images/delete",
  async (imageType, thunkAPI) => {
    try {
                         const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/aboutusimg/${imageType}`,
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
        toast.error(data.message || "Failed to delete image");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Image deleted successfully");
      thunkAPI.dispatch(getAboutUsImages()); // Refresh images
      return imageType;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const aboutUsSlice = createSlice({
  name: "aboutUs",
  initialState: {
    aboutUsData: null,
    aboutUsImages: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET DETAILS
      .addCase(getAboutUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsData = action.payload;
      })
      .addCase(getAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // EDIT DETAILS
      .addCase(editAboutUs.pending, (state) => {
        state.loading = true;
      })
      .addCase(editAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsData = action.payload.data;
      })
      .addCase(editAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET IMAGES
      .addCase(getAboutUsImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAboutUsImages.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsImages = action.payload;
      })
      .addCase(getAboutUsImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE IMAGE
      .addCase(createAboutUsImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAboutUsImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createAboutUsImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE IMAGE
      .addCase(deleteAboutUsImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAboutUsImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteAboutUsImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default aboutUsSlice.reducer;