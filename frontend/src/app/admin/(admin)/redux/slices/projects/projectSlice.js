// redux/slices/projectsSlice/projectsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getCookie } from 'cookies-next';

/* ============================
   GET ALL Projects MEMBERS
============================ */
export const getAllProjects = createAsyncThunk(
  "projects/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/projects`
      );

      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch projects");
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   CREATE Projects MEMBER
============================ */
export const createProjects = createAsyncThunk(
  "projects/create",
  async (formData, thunkAPI) => {
    // console.log(formData, "from slice")
    try {
             const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/projects`,
        {
          method: "POST",
           headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create projects member");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Projects member created successfully");
      thunkAPI.dispatch(getAllProjects());
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// update project 
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = getCookie("token");

      // Convert FormData → plain object → JSON
      const plainObject = Object.fromEntries(formData.entries());

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/updateproject/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",  
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(plainObject),  
        }
      );
      console.log(res)

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update project");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Project updated successfully");
      thunkAPI.dispatch(getAllProjects());
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   DELETE Projects MEMBER
============================ */
export const deleteProjects = createAsyncThunk(
  "projects/delete",
  async (id, thunkAPI) => {
    try {
             const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/projects/${id}`,
        {
          method: "DELETE",
           headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete projects member");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Projects member deleted successfully");
      thunkAPI.dispatch(getAllProjects());
      return id;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projectsData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL Projects
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projectsData = action.payload;
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE Projects
      .addCase(createProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProjects.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE Projects
      .addCase(deleteProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProjects.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default projectsSlice.reducer;