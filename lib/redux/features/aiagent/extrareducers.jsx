import { handleconnectAiAgentFulfilled,handleconnectAiAgentPending,handleconnectAiAgentRejected } from "./handlers";
import { connectAiAgent } from "./thunks";

export const authExtraReducers = (builder) => {
  builder
    .addCase(connectAiAgent.pending, handleconnectAiAgentPending)
    .addCase(connectAiAgent.fulfilled, handleconnectAiAgentFulfilled)
    .addCase(connectAiAgent.rejected, handleconnectAiAgentRejected);
};
