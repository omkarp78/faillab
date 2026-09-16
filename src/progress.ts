export type CaseProgress={attempts:number;bestScore:number;solved:boolean;iqAwarded:number;lastPlayed:string|null};
export type Progress={iq:number;bestScore:number;streak:number;lastCompleted:string|null;attempts:number;cases:Record<string,CaseProgress>};
export type AttemptUpdate={progress:Progress;iqGained:number;previousBest:number;newBest:boolean;firstSolve:boolean};

const KEY='faillab-progress-v2';
const LEGACY_KEY='faillab-progress-v1';
export const emptyProgress:Progress={iq:0,bestScore:0,streak:0,lastCompleted:null,attempts:0,cases:{}};
const emptyCase=():CaseProgress=>({attempts:0,bestScore:0,solved:false,iqAwarded:0,lastPlayed:null});

function localDay(date=new Date()){
 const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
 return `${y}-${m}-${d}`;
}
function previousLocalDay(){const d=new Date();d.setDate(d.getDate()-1);return localDay(d)}

export function saveProgress(progress:Progress){
 localStorage.setItem(KEY,JSON.stringify(progress));
}

export function loadProgress():Progress{
 try{
  const raw=localStorage.getItem(KEY);
  if(raw){const parsed=JSON.parse(raw);return{...emptyProgress,...parsed,cases:{...(parsed.cases||{})}}}
  const legacy=localStorage.getItem(LEGACY_KEY);
  if(legacy){const old=JSON.parse(legacy);return{...emptyProgress,iq:Number(old.iq)||0,bestScore:Number(old.bestScore)||0,streak:Number(old.streak)||0,lastCompleted:old.lastCompleted||null,attempts:Number(old.attempts)||0,cases:{}}}
 }catch{}
 return emptyProgress;
}

export function mergeProgress(local:Progress,cloud:Progress):Progress{
 const codes=new Set([...Object.keys(local.cases||{}),...Object.keys(cloud.cases||{})]);
 const mergedCases:Record<string,CaseProgress>={};
 codes.forEach(code=>{
  const a={...emptyCase(),...(local.cases?.[code]||{})};
  const b={...emptyCase(),...(cloud.cases?.[code]||{})};
  mergedCases[code]={
   attempts:Math.max(a.attempts,b.attempts),
   bestScore:Math.max(a.bestScore,b.bestScore),
   solved:a.solved||b.solved,
   iqAwarded:Math.max(a.iqAwarded,b.iqAwarded),
   lastPlayed:[a.lastPlayed,b.lastPlayed].filter(Boolean).sort().at(-1)??null
  };
 });
 const iq=Object.values(mergedCases).reduce((sum,c)=>sum+c.iqAwarded,0);
 return{
  iq,
  bestScore:Math.max(local.bestScore,cloud.bestScore),
  streak:Math.max(local.streak,cloud.streak),
  lastCompleted:[local.lastCompleted,cloud.lastCompleted].filter(Boolean).sort().at(-1)??null,
  attempts:Math.max(local.attempts,cloud.attempts),
  cases:mergedCases
 };
}

export function recordAttempt(code:string,score:number,baseIq:number,correct:boolean):AttemptUpdate{
 const p=loadProgress();
 const current={...emptyCase(),...(p.cases[code]||{})};
 const today=localDay();
 const previousBest=current.bestScore;
 const newBest=score>previousBest;
 const firstSolve=correct&&!current.solved;
 const iqGained=Math.max(0,baseIq-current.iqAwarded);
 const nextCase:CaseProgress={attempts:current.attempts+1,bestScore:Math.max(current.bestScore,score),solved:current.solved||correct,iqAwarded:Math.max(current.iqAwarded,baseIq),lastPlayed:today};
 let streak=p.streak;
 let lastCompleted=p.lastCompleted;
 if(correct&&p.lastCompleted!==today){streak=p.lastCompleted===previousLocalDay()?p.streak+1:1;lastCompleted=today}
 const next:Progress={...p,iq:p.iq+iqGained,bestScore:Math.max(p.bestScore,score),streak,lastCompleted,attempts:p.attempts+1,cases:{...p.cases,[code]:nextCase}};
 saveProgress(next);
 return{progress:next,iqGained,previousBest,newBest,firstSolve};
}

export function caseProgress(p:Progress,code:string):CaseProgress{return{...emptyCase(),...(p.cases[code]||{})}}
export function solvedCount(p:Progress){return Object.values(p.cases).filter(c=>c.solved).length}
export function rankFor(iq:number){if(iq>=800)return'Principal Investigator';if(iq>=500)return'Failure Analyst';if(iq>=250)return'Investigator II';if(iq>=100)return'Investigator I';return'Trainee Investigator'}
