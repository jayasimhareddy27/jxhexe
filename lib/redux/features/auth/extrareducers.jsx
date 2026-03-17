import { loginUser } from './thunks';
import {  handleAuthPending,  handleAuthFulfilled,  handleAuthRejected} from './handlers';

export const authExtraReducers = (builder) => {
  // --- LOGIN ---
  builder
    .addCase(loginUser.pending, handleAuthPending)
    .addCase(loginUser.fulfilled, handleAuthFulfilled)
    .addCase(loginUser.rejected, handleAuthRejected);
};
