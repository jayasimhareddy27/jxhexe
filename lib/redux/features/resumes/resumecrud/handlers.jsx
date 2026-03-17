// GENERIC
export const handlePending = (state) => {
  state.loading = "loading";
  state.error = null;
};

export const handleRejected = (state, action) => {
  state.loading = "failed";
  state.error = action.error?.message || "Something went wrong";
};

// SPECIFIC
export const handleFetchResumesFulfilled = (state, action) => {
  state.loading = "succeeded";
  state.allResumes = action.payload.resumes;
  state.primaryResumeId = action.payload.primaryResumeId;
  state.aiResumeRef = action.payload.aiResumeRef;
  state.myProfileRef = action.payload.myProfileRef;
};


export const handleReturnUseReferenceFulfilled = (state, action) => {
  state.loading = "succeeded";
  const { references } = action.payload;

  if (references) {
    state.primaryResumeId = references.primaryResumeRef || null;
    state.aiResumeRef = references.aiResumeRef || null;
    state.myProfileRef = references.myProfileRef || null;
    state.favResumeTemplateId = references.favResumeTemplateId || null;
  }
};
