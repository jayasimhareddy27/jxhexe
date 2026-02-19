export const handleAuthPending = (state) => {
  state.loading = 'loading';
  state.error = null;
};

export const handleAuthRejected = (state, action) => {
  state.loading = 'failed';
  state.error = "action.payload";
};

export const handleAuthFulfilled = (state, action) => {
  state.loading = 'succeeded';
  state.error = null;
  state.user = action.payload.user;
  state.token = action.payload.token;

  localStorage.setItem('token', action.payload.token);

};

export const handleUpdateAccountFulfilled = (state, action) => {
  state.loading = 'succeeded';
  state.error = null;
  state.user = {
    ...state.user,
    ...action.payload,
  };
};
