const clearAuthStorage = () => {
  [
    "token",
    "resumeRefs",
    "resumeFileName",
    "resumeRawText",
    "theme",
  ].forEach((k) => localStorage.removeItem(k));
};

export const setCredentials = (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  localStorage.setItem('token', action.payload.token);

};

export const clearCredentials = (state) => {
  state.user = null;
  state.token = null;
  clearAuthStorage();
};

