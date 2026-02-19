
export const showToast = (state, action) => {
  state.message = action.payload.message;
  state.type = action.payload.type || 'info';
  state.visible = true;
};

export const hideToast = (state) => {
  state.visible = false;
  state.message = '';
}


