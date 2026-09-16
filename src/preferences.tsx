import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from 'react';
import {Languages,Moon,Sun} from 'lucide-react';

export type AppLanguage='en'|'hi'|'mr';
export type AppTheme='dark'|'light';

type PreferencesContextValue={
 language:AppLanguage;
 theme:AppTheme;
 setLanguage:(language:AppLanguage)=>void;
 toggleTheme:()=>void;
};

const LANGUAGE_KEY='faillab-language-v1';
const THEME_KEY='faillab-theme-v1';

const PreferencesContext=createContext<PreferencesContextValue|null>(null);

function initialLanguage():AppLanguage{
 const saved=localStorage.getItem(LANGUAGE_KEY);
 return saved==='hi'||saved==='mr'||saved==='en'?saved:'en';
}

function initialTheme():AppTheme{
 const saved=localStorage.getItem(THEME_KEY);
 if(saved==='dark'||saved==='light')return saved;
 return window.matchMedia?.('(prefers-color-scheme: light)').matches?'light':'dark';
}

export function PreferencesProvider({children}:{children:ReactNode}){
 const [language,setLanguageState]=useState<AppLanguage>(initialLanguage);
 const [theme,setTheme]=useState<AppTheme>(initialTheme);

 useEffect(()=>{
  document.documentElement.dataset.theme=theme;
  localStorage.setItem(THEME_KEY,theme);
 },[theme]);

 useEffect(()=>{
  document.documentElement.lang=language;
  localStorage.setItem(LANGUAGE_KEY,language);
 },[language]);

 const value=useMemo<PreferencesContextValue>(()=>({
  language,
  theme,
  setLanguage:setLanguageState,
  toggleTheme:()=>setTheme(current=>current==='dark'?'light':'dark')
 }),[language,theme]);

 return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(){
 const value=useContext(PreferencesContext);
 if(!value)throw new Error('usePreferences must be used inside PreferencesProvider');
 return value;
}

const languageLabels:Record<AppLanguage,string>={en:'EN',hi:'हिं',mr:'मर'};
const languageNames:Record<AppLanguage,string>={en:'English',hi:'हिन्दी',mr:'मराठी'};

export function PreferencesBar(){
 const {language,theme,setLanguage,toggleTheme}=usePreferences();
 return <aside className="preferences-bar" aria-label="Display and language settings">
  <div className="preferences-language" title="Language" role="group" aria-label="Language">
   <Languages size={15} aria-hidden="true"/>
   {(['en','hi','mr'] as AppLanguage[]).map(code=><button key={code} type="button" className={language===code?'active':''} onClick={()=>setLanguage(code)} aria-label={languageNames[code]} aria-pressed={language===code} title={languageNames[code]}>{languageLabels[code]}</button>)}
  </div>
  <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={theme==='dark'?'Switch to light mode':'Switch to dark mode'} aria-pressed={theme==='light'} title={theme==='dark'?'Light mode':'Dark mode'}>
   {theme==='dark'?<Sun size={16} aria-hidden="true"/>:<Moon size={16} aria-hidden="true"/>}<span>{theme==='dark'?'Light':'Dark'}</span>
  </button>
 </aside>;
}
