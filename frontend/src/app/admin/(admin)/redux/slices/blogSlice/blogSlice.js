// redux/slices/blogSlice/blogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

/* ============================
   GET ALL BLOGS
============================ */
export const getAllBlogs = createAsyncThunk(
  "blogs/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/blogs`
      );
      
      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }
      
      const data = await res.json();
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to fetch blogs");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   CREATE BLOG
============================ */
export const createBlog = createAsyncThunk(
  "blogs/create",
  async (formData, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/blogs`,
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
        toast.error(data.message || "Failed to create blog");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Blog created successfully");
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   DELETE BLOG
============================ */
export const deleteBlog = createAsyncThunk(
  "blogs/delete",
  async (blogId, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/blogs/${blogId}`,
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
        toast.error(data.message || "Failed to delete blog");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Blog deleted successfully");
      thunkAPI.dispatch(getAllBlogs());
      return blogId;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   UPDATE BLOG
============================ */
export const updateBlog = createAsyncThunk(
  "blogs/update",
  async ({ id, formData }, thunkAPI) => {
    try {
                   const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/blogs/${id}`,
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
        toast.error(data.message || "Failed to update blog");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Blog updated successfully");
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
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogData: [],
    loading: false,
    error: null,
    currentBlog: null,
  },
  reducers: {
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL BLOGS
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogData = action.payload;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE BLOG
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogData.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE BLOG
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogData = state.blogData.filter(blog => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE BLOG
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogData.findIndex(blog => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogData[index] = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentBlog, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;