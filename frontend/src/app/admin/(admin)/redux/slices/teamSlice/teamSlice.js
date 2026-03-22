// redux/slices/teamSlice/teamSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getCookie } from 'cookies-next';

/* ============================
   GET ALL TEAM MEMBERS
============================ */
export const getAllTeam = createAsyncThunk(
  "team/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/team`
      );
      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch team");
      }

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   CREATE TEAM MEMBER
============================ */
export const createTeam = createAsyncThunk(
  "team/create",
  async (formData, thunkAPI) => {
    try {
             const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/team`,
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
        toast.error(data.message || "Failed to create team member");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Team member created successfully");
      thunkAPI.dispatch(getAllTeam());
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   DELETE TEAM MEMBER
============================ */
export const deleteTeam = createAsyncThunk(
  "team/delete",
  async (id, thunkAPI) => {
    try {
             const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/team/${id}`,
        {
          method: "DELETE",
           headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete team member");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Team member deleted successfully");
      thunkAPI.dispatch(getAllTeam());
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
const teamSlice = createSlice({
  name: "team",
  initialState: {
    teamData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL TEAM
      .addCase(getAllTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teamData = action.payload;
      })
      .addCase(getAllTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE TEAM
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE TEAM
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamSlice.reducer;