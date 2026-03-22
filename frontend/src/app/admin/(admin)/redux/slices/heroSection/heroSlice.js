
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';


// 1. Get hero section 
export const getHeroSection = createAsyncThunk(
  'getHeroSection',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/herosection`,
        {
          method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        }
      );
      const data = await res.json();
      
      if (!res.ok) {
          return thunkAPI.rejectWithValue(data.message || 'Failed to fetch ');
        }
        
        // Return the data directly if it's nested
        // console.log(data.data, "from slice hero")
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
)
// 2. Get Hero section image
export const getHeroSectionImage = createAsyncThunk(
  'getHeroSectionImage',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contents/herosectionimg`,
        {
          method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        }
      );
      const data = await res.json();
    //   console.log(data, "from slice hero")
      if (!res.ok) {
          return thunkAPI.rejectWithValue(data.message || 'Failed to fetch ');
        }
        
        // Return the data directly if it's nested
        // console.log(data, "from slice hero")
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
)

// 3. post hero image 
export const createHeroSectionImage = createAsyncThunk(
  'createHeroSectionImage',
  async ({ images, title }, thunkAPI) => {
    //   console.log(title, "tl from slice")
    try {
                   const token = getCookie('token'); // read from cookie

      const formData = new FormData();
      formData.append("title", title);
      formData.append("images", images.file); 

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contents/herosectionimg`, {
        method: 'POST',
      headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
        body: formData,
      });

    //   console.log(res)

      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to upload');
      }
      if(data.success) {
        toast.success(data.message)
      }

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 4. delete hero image 
export const deleteHeroSectionImage = createAsyncThunk(
    'deleteHeroImage', 
    async (id, thunkAPI) => {
        try {
                       const token = getCookie('token'); // read from cookie

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contents/herosectionimg/${id}`, {
                method: 'DELETE',
                 headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
                // credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || 'Failed to delete')
                return thunkAPI.rejectWithValue(data.message || 'Failed to delete');
            }
            if(data.success) {
                toast.success(data.message)
            }
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
)

// 5. edit hero section 
export const editHeroSection = createAsyncThunk(
    'editHeroSection',
    async (formData, thunkAPI) => {
        // console.log(formData, "form data")
        try {
                       const token = getCookie('token'); // read from cookie

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contents/herosection`, {
                method: 'PUT',
              headers: {
          Authorization: `Bearer ${token}`, // send token manually
        },
               body: formData
            });
            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                toast.error(data.message || 'Failed to edit')
                return thunkAPI.rejectWithValue(data.message || 'Failed to edit');
            }
            if(data.success) {
                toast.success(data.message)
            }
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
)
// slice 
const heroSectionSlice = createSlice({
  name: 'heroSection',
  initialState: {
    hesroSectionData: [],
    heroSectionImageData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // get Hero Section
  builder
  .addCase(getHeroSection.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getHeroSection.fulfilled, (state, action) => {
    state.loading = false;
    state.hesroSectionData = action.payload;
  })
  .addCase(getHeroSection.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

  // get Hero Section Image
  builder
  .addCase(getHeroSectionImage.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getHeroSectionImage.fulfilled, (state, action) => {
    state.loading = false;
    state.heroSectionImageData = action.payload;
  })
  .addCase(getHeroSectionImage.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

  // post Hero Section Image
  builder
  .addCase(createHeroSectionImage.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(createHeroSectionImage.fulfilled, (state, action) => {
    state.loading = false;
    state.heroSectionImageData = action.payload.data;
  })
  .addCase(createHeroSectionImage.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

//  delete hero image 
  builder
  .addCase(deleteHeroSectionImage.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(deleteHeroSectionImage.fulfilled, (state, action) => {
    state.loading = false;
  state.heroSectionImageData = action.payload.data;
  })
  .addCase(deleteHeroSectionImage.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })

//   edit hero section 
  builder
  .addCase(editHeroSection.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(editHeroSection.fulfilled, (state, action) => {
    state.loading = false;
    state.hesroSectionData = action.payload;
  })
  .addCase(editHeroSection.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
  },
});
export default heroSectionSlice.reducer;
