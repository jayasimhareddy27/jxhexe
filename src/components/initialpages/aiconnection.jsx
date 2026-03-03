'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectAiAgent } from '../../../lib/redux/features/aiagent/thunks';
import { resetStatus } from '../../../lib/redux/features/aiagent/slice';
import { displayToast } from '../../../lib/redux/features/toast/thunks';
import { Bot, RefreshCw, AlertCircle } from 'lucide-react';

export default function AIConnectionFloating() {
  const dispatch = useDispatch();
  const { isReady, loading, error } = useSelector((state) => state.aiAgent);

  // Auto-connect on mount
  useEffect(() => {
    if (!isReady && loading === 'idle') {
      dispatch(connectAiAgent());
    }
  }, [dispatch, isReady, loading]);

  const handleToggle = async () => {
    // If already connected → disconnect
    if (isReady) {
      dispatch(resetStatus());
      dispatch(displayToast({ message: 'AI Disconnected', type: 'info' }));
      return;
    }

    // If disconnected → connect
    const result = await dispatch(connectAiAgent());

    if (connectAiAgent.fulfilled.match(result)) {
      dispatch(displayToast({
        message: 'Chrome AI Connected',
        type: 'success'
      }));
    } else {
      dispatch(displayToast({
        message: result.payload || 'AI connection failed',
        type: 'error'
      }));
    }
  };

  return (
    <footer className="fixed bottom-6 right-6 z-50 select-none">
      <div
        onClick={handleToggle}
        className={`relative flex items-center justify-center rounded-full shadow-2xl cursor-pointer transition-all duration-300
          ${isReady ? 'bg-emerald-500' : 'bg-red-500'}
          ${loading === 'loading' ? 'ring-4 ring-indigo-200' : ''}
          text-white hover:scale-105 active:scale-90`}
        style={{ width: 56, height: 56 }}
      >
        {loading === 'loading' ? (
          <RefreshCw size={24} className="animate-spin" />
        ) : error ? (
          <AlertCircle size={24} />
        ) : (
          <Bot size={28} />
        )}

        {/* status dot */}
        <div className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isReady ? 'bg-emerald-400' : 'bg-white'}`}/>
      </div>
    </footer>
  );
}