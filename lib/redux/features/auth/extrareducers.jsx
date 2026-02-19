import { loginUser, signupUser, updateAccount } from './thunks';
import {  handleAuthPending,  handleAuthFulfilled,  handleAuthRejected,  handleUpdateAccountFulfilled,} from './handlers';

export const authExtraReducers = (builder) => {
  // --- LOGIN ---
  builder
    .addCase(loginUser.pending, handleAuthPending)
    .addCase(loginUser.fulfilled, handleAuthFulfilled)
    .addCase(loginUser.rejected, handleAuthRejected);

  // --- SIGNUP ---
  builder
    .addCase(signupUser.pending, handleAuthPending)
    .addCase(signupUser.fulfilled, handleAuthFulfilled)
    .addCase(signupUser.rejected, handleAuthRejected);

  // --- UPDATE ACCOUNT ---
  builder
    .addCase(updateAccount.pending, handleAuthPending)
    .addCase(updateAccount.fulfilled, handleUpdateAccountFulfilled)
    .addCase(updateAccount.rejected, handleAuthRejected);
};
