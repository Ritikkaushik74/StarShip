import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CREDITS_STORAGE_KEY = '@starship_shop_credits';

export const loadCredits = createAsyncThunk(
  'credits/loadCredits',
  async (_, { rejectWithValue }) => {
    try {
      const storedCredits = await AsyncStorage.getItem(CREDITS_STORAGE_KEY);
      if (storedCredits !== null) {
        return parseInt(storedCredits, 10);
      }
      return 0;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveCredits = createAsyncThunk(
  'credits/saveCredits',
  async (credits, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem(CREDITS_STORAGE_KEY, credits.toString());
      return credits;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  totalCredits: 0,
  loading: false,
  error: null,
};

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    addCredits: (state, action) => {
      state.totalCredits += action.payload;
    },
    resetCredits: (state) => {
      state.totalCredits = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCredits = action.payload;
      })
      .addCase(loadCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCredits = action.payload;
      })
      .addCase(saveCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectTotalCredits = (state) => state.credits.totalCredits;
export const selectCreditsLoading = (state) => state.credits.loading;

export const { addCredits, resetCredits } = creditsSlice.actions;
export default creditsSlice.reducer;
