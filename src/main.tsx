import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {LocalizationBridge} from './LocalizationBridge';
import {PreferencesBar,PreferencesProvider} from './preferences';
import './styles.css';
import './preferences.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
  <PreferencesProvider>
   <LocalizationBridge/>
   <PreferencesBar/>
   <App/>
  </PreferencesProvider>
 </React.StrictMode>
);
