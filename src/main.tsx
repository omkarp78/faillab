import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {PreferencesBar,PreferencesProvider} from './preferences';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
  <PreferencesProvider>
   <PreferencesBar/>
   <App/>
  </PreferencesProvider>
 </React.StrictMode>
);