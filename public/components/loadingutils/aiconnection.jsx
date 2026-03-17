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

  useEffect(() => {
    if (!isReady && loading === 'idle') {
      dispatch(connectAiAgent());
    }
  }, [dispatch, isReady, loading]);

  const handleToggle = async () => {
    if (isReady) {
      dispatch(resetStatus());
      dispatch(displayToast({ message: 'AI Disconnected', type: 'info' }));
      return;
    }

    const result = await dispatch(connectAiAgent());
    if (connectAiAgent.fulfilled.match(result)) {
      dispatch(displayToast({ message: 'Chrome AI Connected', type: 'success' }));
    } else {
      dispatch(displayToast({ message: result.payload || 'AI connection failed', type: 'error' }));
    }
  };

  return (
    <div
      onClick={handleToggle}
      className="relative flex items-center justify-center rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer hover:scale-110 active:scale-90 transition-transform select-none z-[9999]"
      style={{ 
        width: '52px', 
        height: '52px', 
        // Using explicit inline colors completely bypasses Tailwind purging bugs!
        backgroundColor: isReady ? '#10b981' : '#ef4444', 
        color: '#ffffff',
        border: loading === 'loading' ? '4px solid #c7d2fe' : 'none'
      }}
      title={isReady ? "Disconnect Chrome AI" : "Connect Chrome AI"}
    >
      {loading === 'loading' ? (
        <RefreshCw size={24} className="animate-spin text-white" />
      ) : error ? (
        <AlertCircle size={24} className="text-white" />
      ) : (
        <Bot size={28} className="text-white" />
      )}

      {/* Status Dot */}
      <div 
        className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
        style={{ backgroundColor: isReady ? '#6ee7b7' : '#ffffff' }}
      />
    </div>
  );
}