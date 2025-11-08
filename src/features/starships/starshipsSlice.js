import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as swapiAPI from '../../api/swapi';

export const fetchStarships = createAsyncThunk(
  'starships/fetchStarships',
  async (page = 1, { rejectWithValue }) => {
    try {
      const data = await swapiAPI.getStarships(page);
      const starshipsWithIds = data.results.map((ship) => ({
        ...ship,
        id: ship.url.match(/\/(\d+)\/$/)?.[1] || Math.random().toString(),
      }));
      return {
        results: starshipsWithIds,
        next: data.next,
        previous: data.previous,
        count: data.count,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchStarships = createAsyncThunk(
  'starships/searchStarships',
  async (query, { rejectWithValue }) => {
    try {
      const data = await swapiAPI.searchStarships(query);
      const starshipsWithIds = data.results.map((ship) => ({
        ...ship,
        id: ship.url.match(/\/(\d+)\/$/)?.[1] || Math.random().toString(),
      }));
      return starshipsWithIds;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  searchResults: [],
  loading: false,
  searchLoading: false,
  error: null,
  searchError: null,
  hasMore: false,
  currentPage: 1,
};

const starshipsSlice = createSlice({
  name: 'starships',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStarships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStarships.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.hasMore = !!action.payload.next;
        state.currentPage = action.meta.arg;
      })
      .addCase(fetchStarships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch starships';
      })
      .addCase(searchStarships.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchStarships.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchStarships.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload || 'Failed to search starships';
      });
  },
});

export const { clearSearchResults } = starshipsSlice.actions;
export default starshipsSlice.reducer;
