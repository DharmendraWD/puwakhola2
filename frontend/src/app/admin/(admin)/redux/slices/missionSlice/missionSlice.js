// redux/slices/missionSlice/missionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

/* ============================
   GET MISSION TEXT
============================ */
export const getMission = createAsyncThunk(
  "mission/get",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/mission`
      );
      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch Mission");
      }

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   UPDATE MISSION TEXT
============================ */
export const editMission = createAsyncThunk(
  "mission/edit",
  async (formData, thunkAPI) => {
    // console.log(formData)
    try {
                         const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/mission`,
        {
          method: "PUT", //  Changed to PUT to match backend route
          // credentials: "include",
              headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
          body: formData,
        }
      );

      const data = await res.json();
      // console.log(data)

      if (!res.ok) {
        toast.error(data.message || "Failed to update Mission");
        return thunkAPI.rejectWithValue(data.message);
      }

      toast.success(data.message || "Mission updated");
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   GET MISSION IMAGES
============================ */
export const getMissionImages = createAsyncThunk(
  "mission/images/get",
  async (_, thunkAPI) => {
    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/missionimg`
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
   CREATE/UPDATE MISSION IMAGE
============================ */
export const createMissionImage = createAsyncThunk(
  "mission/images/create",
  async (formData, thunkAPI) => {
    
    try {
      const token = getCookie('token'); // read from cookie
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/missionimg`,
        {
          method: "PUT", //  Changed to PUT to match backend route
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
      thunkAPI.dispatch(getMissionImages());
      return data.data;
    } catch (err) {
      toast.error(err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* ============================
   DELETE MISSION IMAGE
============================ */
export const deleteMissionImage = createAsyncThunk(
  "mission/images/delete",
  async (imageType, thunkAPI) => {
    try {
             const token = getCookie('token'); // read from cookie

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/missionimg/${imageType}`,
        {
          method: "DELETE",
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
      thunkAPI.dispatch(getMissionImages());
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
const missionSlice = createSlice({
  name: "mission",
  initialState: {
    missionData: null,
    missionImages: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET MISSION
      .addCase(getMission.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMission.fulfilled, (state, action) => {
        state.loading = false;
        state.missionData = action.payload;
      })
      .addCase(getMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // EDIT MISSION
      .addCase(editMission.pending, (state) => {
        state.loading = true;
      })
      .addCase(editMission.fulfilled, (state, action) => {
        state.loading = false;
        state.missionData = action.payload;
      })
      .addCase(editMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET IMAGES
      .addCase(getMissionImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMissionImages.fulfilled, (state, action) => {
        state.loading = false;
        state.missionImages = action.payload;
      })
      .addCase(getMissionImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE IMAGE
      .addCase(createMissionImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMissionImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createMissionImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE IMAGE
      .addCase(deleteMissionImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMissionImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteMissionImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default missionSlice.reducer;