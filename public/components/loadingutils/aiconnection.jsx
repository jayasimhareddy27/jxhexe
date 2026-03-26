import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { setAgent, clearAgent } from '../../../lib/redux/features/aiagent/slice';
import { displayToast } from '../../../lib/redux/features/toast/thunks';
import { Bot, RotateCcw, Settings, LogOut, Loader2 } from 'lucide-react';
import { connectAiAgent } from '../../../lib/redux/features/aiagent/thunks';

export default function AIConnectionFloating({ setActiveTab }) {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  
  const { agent: aiAgent, loading } = useSelector((state) => state.aiAgent, shallowEqual);
  const isBusy = loading === 'loading';

  useEffect(() => {
    if (!aiAgent) {
      const stored = localStorage.getItem('CurrentAiAgent');
      if (stored) {
        try {
          dispatch(setAgent(JSON.parse(stored)));
        } catch (e) {
          localStorage.removeItem('CurrentAiAgent');
        }
      }
    }
  }, [dispatch, aiAgent]);

  const handleChromeAIConnect = async () => {
    const config = { provider: 'ChromeAI', model: 'Gemini Nano', ApiKey: null };
    const resultAction = await dispatch(connectAiAgent(config));

    if (connectAiAgent.fulfilled.match(resultAction)) {
      dispatch(displayToast({ message: 'Connected to Chrome AI', type: 'success' }));
    } else {
      dispatch(displayToast({ 
        message: resultAction.payload || 'Failed to connect', 
        type: 'error' 
      }));
    }
    setExpanded(false);
  };

  const handleDisconnect = () => {
    dispatch(clearAgent());
    localStorage.removeItem('CurrentAiAgent');
    dispatch(displayToast({ message: 'AI Agent Disconnected', type: 'info' }));
    setExpanded(false);
  };

  const handleOpenSettings = () => {
    if (setActiveTab) {
      setActiveTab(7); // Navigates to the hidden Settings tab
      setExpanded(false);
    }
  };

  return (
    <div className="flex flex-col items-center select-none space-y-4">      
      {expanded && (
        <div className="flex flex-col items-center gap-4 mb-2 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          <button
            onClick={handleChromeAIConnect}
            title="Reconnect Chrome AI"
            disabled={isBusy}
            className="w-60 p-2 flex items-center justify-center rounded-full text-white cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all border-none"
            style={{ backgroundColor: '#eab308' }} 
          >
            <RotateCcw  />
          </button>

          <button
            onClick={handleOpenSettings}
            title="AI Command Center"
            className="w-60 p-2 flex items-center justify-center rounded-full text-white cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all border-none"
            style={{ backgroundColor: '#3b82f6' }} 
          >
            <Settings  />
          </button>

          {aiAgent && (
            <button
              onClick={handleDisconnect}
              title="Disconnect"
              className="w-60 p-2 flex items-center justify-center rounded-full text-white cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all border-none"
              style={{ backgroundColor: '#dc2626' }}
            >
              <LogOut />
            </button>
          )}
        </div>
      )}

      <button 
        onClick={() => !isBusy && setExpanded((prev) => !prev)}
        className="flex items-center justify-center rounded-full shadow-2xl cursor-pointer transition-all duration-300 text-white hover:scale-105 active:scale-90 border-none"
        style={{ 
          width: 60, height: 60,
          backgroundColor: aiAgent ? '#16a34a' : '#dc2626', 
          boxShadow: aiAgent 
            ? '0 0 0 4px rgba(22, 163, 74, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
            : '0 0 0 4px rgba(220, 38, 38, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {isBusy ? <Loader2 className="animate-spin" size={28} /> : <Bot size={30} />}
      </button>
    </div>
  );
}