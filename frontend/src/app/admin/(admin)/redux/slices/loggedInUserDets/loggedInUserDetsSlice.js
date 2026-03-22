

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'cookies-next';

// Thunk for login API call
export const userDets = createAsyncThunk(
  'userDets',
  async (accessToken, { rejectWithValue }) => {
    try {
        const token = getCookie('token'); // read from cookie
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/me`, {
      method: 'GET',
     headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
      });

      const data = await res.json();
    //   console.log(data)

      if (!res.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);


const initialState = {
  userData: null,
  loading: false,
  error: null,
};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login
    builder.addCase(userDets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userDets.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    });
    builder.addCase(userDets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Login failed';
    });
  },
});

export default userDataSlice.reducer;
