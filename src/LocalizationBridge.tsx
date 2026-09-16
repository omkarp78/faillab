import {useEffect} from 'react';
import {translate,type TranslationKey} from './i18n';
import {usePreferences} from './preferences';
import {translateBeginnerCase} from './beginnerCaseTranslations';

const exact:Record<string,TranslationKey>={
 'ENGINEERING FAILURE GAME':'gameEyebrow','Something failed.':'heroTitle','Can you find out why?':'heroQuestion',
 'Read the problem, inspect clues, run a few tests and choose the most likely cause. You do not need to be an expert — the game teaches you as you play.':'heroBody',
 'YOUR PROGRESS':'yourProgress','ENGINEERING IQ':'engineeringIq','BEST SCORE':'bestScore','DAY STREAK':'dayStreak','CASES SOLVED':'casesSolved',
 'Syncing progress…':'syncingProgress','Cloud progress synced':'cloudSynced','Sign out':'signOut','Sign in with Google':'signInGoogle',
 'Guest mode · progress saved on this device':'guestMode','CHOOSE A CASE':'chooseCase','Pick your engineering branch':'pickBranch',
 'DEVELOPER TRACK':'developerTrack','All':'all','Civil':'civil','Mechanical':'mechanical','Electrical':'electrical','Computer / IT':'computerIt',
 'All Dev':'allDev','Web Dev':'webDev','Backend':'backend','Languages':'languages','SOLVED':'solved','IN PROGRESS':'inProgress','NEW':'new',
 'ABOUT 5–8 MIN':'aboutTime','Play again':'playAgain','Start case':'startCase','Back':'back','How to play':'howToPlay',
 '1. Read the clues':'readClues','2. Run useful tests using your budget':'runUsefulTests','3. Pick the most likely cause':'pickCause',
 '4. See why the answer is right or wrong':'seeWhy','Your goal':'yourGoal','Previous best':'previousBest','Start investigation':'startInvestigation',
 'YOU FOUND THE ROOT CAUSE':'foundRootCause','NOT QUITE':'notQuite','Correct diagnosis':'correctDiagnosis','Here is what the evidence shows':'evidenceShows',
 'Correct cause':'correctCause','Clues used':'cluesUsed','Tests':'tests','Budget':'budget','IQ gained':'iqGained','Why?':'why',
 'What should be done?':'whatDone','Main lesson':'mainLesson','Try again':'tryAgain','Choose another case':'chooseAnother','BUDGET LEFT':'budgetLeft',
 'Step 1 — Check the clues':'step1','Tap each clue to mark it as reviewed':'step1Sub','WHAT YOU SEE':'whatYouSee',
 'Start here, then open the clues below.':'startHere','Next: run tests':'nextRunTests','Open all available clues first.':'openAllClues',
 'Step 2 — Run useful tests':'step2','Tests can reveal hidden clues. You do not need to run every test. Try to spend your budget only on tests that help rule causes in or out.':'testsHelp',
 'Done':'done','Too expensive':'tooExpensive','Run test':'runTest','Back to clues':'backClues','Next: choose a cause':'nextChooseCause',
 'Step 3 — Choose the cause':'step3','Pick the explanation best supported by the clues and tests':'step3Sub','Back to tests':'backTests',
 'Submit answer':'submitAnswer','After submitting, the game will explain the correct reasoning.':'afterSubmit','FIND THE FAILURE · LEARN THE WHY':'tagline'
};

const originals=new WeakMap<Text,string>();

function translateDynamic(text:string,language:'en'|'hi'|'mr'){
 let match=text.match(/^(\d+) CASES$/);
 if(match)return `${match[1]} ${translate(language,'cases')}`;
 match=text.match(/^BEST (\d+)$/);
 if(match)return `${translate(language,'best')} ${match[1]}`;
 match=text.match(/^STEP (\d+) OF 3$/);
 if(match)return translate(language,'stepOf',{step:match[1]});
 match=text.match(/^Budget used (\d+)\/(\d+)$/);
 if(match)return translate(language,'budgetUsed',{spent:match[1],budget:match[2]});
 match=text.match(/^(\d+) budget points$/);
 if(match)return `${match[1]} ${translate(language,'budgetPoints')}`;
 match=text.match(/^CASE RESULT · (.+)$/);
 if(match)return `${translate(language,'caseResult')} · ${match[1]}`;
 match=text.match(/^Previous best\s+(\d+\/100)$/);
 if(match)return `${translate(language,'previousBest')} ${match[1]}`;
 return null;
}

function localizeNode(node:Text,language:'en'|'hi'|'mr'){
 if(!originals.has(node))originals.set(node,node.data);
 const original=originals.get(node)??node.data;
 const leading=original.match(/^\s*/)?.[0]??'';
 const trailing=original.match(/\s*$/)?.[0]??'';
 const clean=original.trim();
 if(!clean)return;
 const key=exact[clean];
 const translated=key?translate(language,key):translateDynamic(clean,language)??translateBeginnerCase(language,clean);
 const next=translated?leading+translated+trailing:original;
 if(node.data!==next)node.data=next;
}

function walk(root:Node,language:'en'|'hi'|'mr'){
 if(root.nodeType===Node.TEXT_NODE){localizeNode(root as Text,language);return;}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_FRAGMENT_NODE)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let current=walker.nextNode();
 while(current){localizeNode(current as Text,language);current=walker.nextNode();}
}

export function LocalizationBridge(){
 const {language}=usePreferences();
 useEffect(()=>{
  let applying=false;
  const apply=(root:Node=document.body)=>{if(applying)return;applying=true;walk(root,language);applying=false;};
  apply();
  const observer=new MutationObserver(mutations=>{
   if(applying)return;
   requestAnimationFrame(()=>{
    for(const mutation of mutations){
     if(mutation.type==='characterData')apply(mutation.target);
     mutation.addedNodes.forEach(node=>apply(node));
    }
   });
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  return()=>observer.disconnect();
 },[language]);
 return null;
}
