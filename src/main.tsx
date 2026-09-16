import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import {LocalizationBridge} from './LocalizationBridge';
import {PreferencesBar,PreferencesProvider} from './preferences';
import './styles.css';
import './preferences.css';
import './themePalette.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
  <ErrorBoundary>
   <PreferencesProvider>
    <LocalizationBridge/>
    <PreferencesBar/>
    <App/>
   </PreferencesProvider>
  </ErrorBoundary>
 </React.StrictMode>
);
