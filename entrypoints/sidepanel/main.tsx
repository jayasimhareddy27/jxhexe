import ReactDOM from 'react-dom/client'

import App from '../../src/app/App.jsx'
import '../../src/styles/globals.css'

import ReduxProvider from "../../lib/redux/provider.jsx"; 
import AuthPersistence from '../../lib/redux/features/auth/persistence.jsx';

import ResumesPersistence from '../../lib/redux/features/resumes/resumecrud/persistence.jsx';
import CoverLetterPersistence from '../../lib/redux/features/coverletter/coverlettercrud/persistence.jsx';

import ToastPersistence from '../../lib/redux/features/toast/persistence.jsx';
import ThemePersistence from '../../lib/redux/features/theme/persistence.jsx';
import AIAgentPersistence from '../../lib/redux/features/aiagent/persistence.jsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider>
    <AuthPersistence/>
    <ResumesPersistence/>
    <CoverLetterPersistence/>
    <ToastPersistence/>
    <ThemePersistence />
    <AIAgentPersistence />
    <App />
  </ReduxProvider>
)
