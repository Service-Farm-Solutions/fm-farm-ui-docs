import { lazy, StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import { bypassAuth } from './auth/authMode';

import App from './App.jsx'
import LoadingScreen from './layouts/LoadingScreen.jsx';
import './index.css'

import '@fontsource-variable/raleway';
import '@fontsource-variable/work-sans';

const AuthenticatedApp = lazy(() => import('./auth/AuthenticatedApp'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    {bypassAuth ? <App /> : (
      <Suspense fallback={<LoadingScreen />}>
        <AuthenticatedApp />
      </Suspense>
    )}
  </StrictMode>,
)
