import {useEffect,useState} from 'react';
import {Download,Share2,X} from 'lucide-react';
import {usePreferences} from './preferences';

type BeforeInstallPromptEvent=Event&{
 prompt:()=>Promise<void>;
 userChoice:Promise<{outcome:'accepted'|'dismissed';platform:string}>;
};

const DISMISS_KEY='faillab-install-dismissed-v1';
const DISMISS_MS=7*24*60*60*1000;

const copy={
 en:{title:'Install FailLab',body:'Use FailLab like an app — it opens this same website in its own full-screen window.',install:'Install app',later:'Not now',ios:'On iPhone: tap Share, then “Add to Home Screen”.'},
 hi:{title:'FailLab इंस्टॉल करें',body:'FailLab को ऐप की तरह इस्तेमाल करें — यही वेबसाइट अलग फुल-स्क्रीन विंडो में खुलेगी।',install:'ऐप इंस्टॉल करें',later:'अभी नहीं',ios:'iPhone पर: Share दबाएँ, फिर “Add to Home Screen” चुनें।'},
 mr:{title:'FailLab इंस्टॉल करा',body:'FailLab अॅपसारखे वापरा — हीच वेबसाइट स्वतंत्र फुल-स्क्रीन विंडोमध्ये उघडेल.',install:'अॅप इंस्टॉल करा',later:'आत्ता नको',ios:'iPhone वर: Share दाबा, नंतर “Add to Home Screen” निवडा.'}
} as const;

function isStandalone(){
 return window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator&{standalone?:boolean}).standalone===true;
}

function isIos(){
 return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function InstallAppPrompt(){
 const {language}=usePreferences();
 const [installEvent,setInstallEvent]=useState<BeforeInstallPromptEvent|null>(null);
 const [visible,setVisible]=useState(false);
 const [ios,setIos]=useState(false);
 const t=copy[language];

 useEffect(()=>{
  if(isStandalone())return;
  const dismissed=Number(localStorage.getItem(DISMISS_KEY)||0);
  if(dismissed && Date.now()-dismissed<DISMISS_MS)return;

  const isiOS=isIos();
  setIos(isiOS);

  let timer:number|undefined;
  const showSoon=()=>{timer=window.setTimeout(()=>setVisible(true),2200)};

  const handleBeforeInstall=(event:Event)=>{
   event.preventDefault();
   setInstallEvent(event as BeforeInstallPromptEvent);
   showSoon();
  };
  const handleInstalled=()=>{
   setVisible(false);
   setInstallEvent(null);
   localStorage.removeItem(DISMISS_KEY);
  };

  window.addEventListener('beforeinstallprompt',handleBeforeInstall);
  window.addEventListener('appinstalled',handleInstalled);
  if(isiOS)showSoon();

  return()=>{
   if(timer)window.clearTimeout(timer);
   window.removeEventListener('beforeinstallprompt',handleBeforeInstall);
   window.removeEventListener('appinstalled',handleInstalled);
  };
 },[]);

 const dismiss=()=>{
  localStorage.setItem(DISMISS_KEY,String(Date.now()));
  setVisible(false);
 };

 const install=async()=>{
  if(!installEvent)return;
  await installEvent.prompt();
  const choice=await installEvent.userChoice;
  if(choice.outcome==='accepted'){
   setVisible(false);
   setInstallEvent(null);
  }
 };

 if(!visible || (!installEvent&&!ios))return null;

 return <div className="pwa-install" role="dialog" aria-modal="false" aria-label={t.title}>
  <button className="pwa-close" onClick={dismiss} aria-label={t.later}><X size={18}/></button>
  <img className="pwa-icon" src="/favicon.svg" alt="" aria-hidden="true"/>
  <div className="pwa-copy">
   <strong>{t.title}</strong>
   <p>{ios?t.ios:t.body}</p>
  </div>
  {ios
   ?<div className="pwa-ios-icon" aria-hidden="true"><Share2 size={20}/></div>
   :<button className="pwa-install-button" onClick={install}><Download size={17}/>{t.install}</button>}
  <button className="pwa-later" onClick={dismiss}>{t.later}</button>
 </div>;
}
