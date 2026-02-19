
export const setTheme = (state, action) => {
  state.theme = action.payload;
};

export const toggleTheme = (state) => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
}


