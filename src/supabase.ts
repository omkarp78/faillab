import {createClient,type SupabaseClient} from '@supabase/supabase-js';

const url=(import.meta.env.VITE_SUPABASE_URL as string|undefined)||'https://nufypdpzxgbtoknmfekp.supabase.co';
const key=(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string|undefined)||'sb_publishable_5Z43O6DkQ981_MRCQX1PYw_knPX9N6K';

export const cloudEnabled=Boolean(url&&key);
export const supabase:SupabaseClient|null=cloudEnabled?createClient(url,key,{
 auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
}):null;
