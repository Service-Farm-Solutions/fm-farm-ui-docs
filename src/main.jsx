import React from 'react'
import ReactDOM from 'react-dom/client'
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './auth/authConfig';
import { PublicClientApplication } from '@azure/msal-browser';

import App from './App.jsx'
import './index.css'

import '@fontsource-variable/raleway';
import '@fontsource-variable/work-sans';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
)
