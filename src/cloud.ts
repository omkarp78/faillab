import type {User} from '@supabase/supabase-js';
import {supabase} from './supabase';
import type {Progress} from './progress';

export type CloudProfile={id:string;display_name:string|null;engineering_iq:number;best_score:number;streak:number;solved_cases:number;updated_at:string};

export async function signInWithGoogle(){
 if(!supabase)return;
 await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});
}

export async function signOut(){if(supabase)await supabase.auth.signOut()}

export async function getCurrentUser():Promise<User|null>{
 if(!supabase)return null;
 const {data}=await supabase.auth.getUser();
 return data.user;
}

export function onAuthChange(cb:(user:User|null)=>void){
 if(!supabase)return()=>{};
 const {data}=supabase.auth.onAuthStateChange((_event,session)=>cb(session?.user??null));
 return()=>data.subscription.unsubscribe();
}

export async function pullProgress(userId:string):Promise<Progress|null>{
 if(!supabase)return null;
 const {data,error}=await supabase.from('user_progress').select('progress').eq('user_id',userId).maybeSingle();
 if(error||!data)return null;
 return data.progress as Progress;
}

export async function pushProgress(user:User,progress:Progress){
 if(!supabase)return;
 const displayName=(user.user_metadata?.full_name||user.user_metadata?.name||user.email||'Player') as string;
 await supabase.from('user_progress').upsert({user_id:user.id,progress,updated_at:new Date().toISOString()},{onConflict:'user_id'});
 await supabase.from('profiles').upsert({
  id:user.id,
  display_name:displayName,
  engineering_iq:progress.iq,
  best_score:progress.bestScore,
  streak:progress.streak,
  solved_cases:Object.values(progress.cases).filter(c=>c.solved).length,
  updated_at:new Date().toISOString()
 },{onConflict:'id'});
}

export async function fetchLeaderboard(limit=20):Promise<CloudProfile[]>{
 if(!supabase)return[];
 const {data,error}=await supabase.from('profiles').select('id,display_name,engineering_iq,best_score,streak,solved_cases,updated_at').order('engineering_iq',{ascending:false}).order('solved_cases',{ascending:false}).limit(limit);
 if(error||!data)return[];
 return data as CloudProfile[];
}
