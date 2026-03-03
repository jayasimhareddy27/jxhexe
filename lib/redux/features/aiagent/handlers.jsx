export const handleconnectAiAgentPending = (state) => {
  state.loading = 'loading';
  state.error = null;
};

export const handleconnectAiAgentRejected = (state, action) => {
  state.loading = 'failed';
  state.isReady = false;
  state.error = action.payload;
};

export const handleconnectAiAgentFulfilled = (state) => {
  state.loading = 'succeeded';
  state.isReady = true;
  state.error = null;
};