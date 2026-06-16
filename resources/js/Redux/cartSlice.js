import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDrawerOpen: false,
  searchSuggestions: [],
  searchLoading: false,
  isSearchOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    setSearchSuggestions: (state, action) => {
      state.searchSuggestions = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.searchLoading = action.payload;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
  },
});

export const {
  toggleDrawer,
  openDrawer,
  closeDrawer,
  setSearchSuggestions,
  setSearchLoading,
  toggleSearch,
  openSearch,
  closeSearch,
} = cartSlice.actions;

export default cartSlice.reducer;
