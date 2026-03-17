import {
  fetchResumes,
  returnuseReference
} from "./thunks";

import * as h from "./handlers";

export const resumecrudExtraReducers = (builder) => {
  builder
    // FETCH RESUMES
    .addCase(fetchResumes.pending, h.handlePending)
    .addCase(fetchResumes.fulfilled, h.handleFetchResumesFulfilled)
    .addCase(fetchResumes.rejected, h.handleRejected)

    // RETURN REFERENCES
    .addCase(returnuseReference.pending, h.handlePending)
    .addCase(returnuseReference.fulfilled, h.handleReturnUseReferenceFulfilled)
    .addCase(returnuseReference.rejected, h.handleRejected);
};
