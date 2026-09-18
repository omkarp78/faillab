import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import InstallAppPrompt from './InstallAppPrompt';
import {LocalizationBridge} from './LocalizationBridge';
import {PreferencesBar,PreferencesProvider} from './preferences';
import './styles.css';
import './preferences.css';
import './themePalette.css';
import './pwa.css';

if('serviceWorker' in navigator){
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register('/sw.js').catch(error=>console.warn('FailLab service worker registration failed',error));
 });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
  <ErrorBoundary>
   <PreferencesProvider>
    <LocalizationBridge/>
    <PreferencesBar/>
    <InstallAppPrompt/>
    <App/>
   </PreferencesProvider>
  </ErrorBoundary>
 </React.StrictMode>
);
