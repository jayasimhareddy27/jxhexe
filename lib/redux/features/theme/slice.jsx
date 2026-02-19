import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './state';
// This thunk handles both toggling the theme and saving it to the database.
import { setTheme as sethemeReducer, toggleTheme as toggleThemeReducer } from './reducers';

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // This action is for initializing the theme from localStorage.
    setTheme: sethemeReducer,
    // This is a pure reducer that just toggles the theme in the state.
    toggleTheme: toggleThemeReducer,
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;