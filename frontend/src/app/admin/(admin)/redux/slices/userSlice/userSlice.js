// redux/slices/userSlice/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getCookie } from 'cookies-next';
/* ============================
   GET ALL USERS
============================ */
export const getAllUsers = createAsyncThunk(
  "users/getAll",
  async (accessToken, { rejectWithValue }) => {
    try {
       const token = getCookie('token'); // read from cookie
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/users`,{
             method: "GET",
 headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },

        }
      );
      // console.log(res)
      if (!res.ok) {
               return rejectWithValue(res.message || 'failed to get user');

      }
      
      const data = await res.json();
    // console.log(data)
      return data;
    } catch (err) {
      toast.error(err.message || "Failed to fetch users");
      return rejectWithValue.rejectWithValue(err.message);
    }
  }
);

/* ============================
   CREATE USER
============================ */
export const createUser = createAsyncThunk(
  "users/create",
  async (formData, thunkAPI) => {
    try {
        const token = getCookie('token'); // read from cookie
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/users`, {
          // headers: { cookie: cookieHeader },
          method: "POST",
          body: formData,
           headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
        }
        
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create user");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "User created successfully");
      return data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   DELETE USER
============================ */
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId, thunkAPI) => {
    try {
        const token = getCookie('token'); // read from cookie
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/users/${userId}`, {
          // headers: { cookie: cookieHeader },
          method: "DELETE",
   headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete user");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "User deleted successfully");
      thunkAPI.dispatch(getAllUsers());
      return userId;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   SLICE
============================ */
const userSlice = createSlice({
  name: "users",
  initialState: {
    usersData: [],
    loading: false,
    error: null,
    currentUser: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL USERS
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersData = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE USER
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usersData.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usersData = state.usersData.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;