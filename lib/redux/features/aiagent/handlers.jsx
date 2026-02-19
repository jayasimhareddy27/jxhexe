export const handleconnectAiAgentPending = (state) => {
  state.loading = 'loading';
  state.error = null;
}

export const handleconnectAiAgentRejected = (state, action) => {
  state.loading = 'failed';
  state.error = action.payload;
  state.agent = null;
  state.provider = null;
  state.apiKey = null;
}

export const handleconnectAiAgentFulfilled = (state, action) => {
  state.loading = 'succeeded';
  state.agent = action.payload.model || action.payload.provider;
  state.provider = action.payload.provider;
  state.apiKey = action.payload.ApiKey;
}

