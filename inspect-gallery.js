const fs = require('fs');
const env = fs.readFileSync('C:/projects/magnus-site-v2/.env','utf8');
const get = (k) => { const m = env.match(new RegExp('^'+k+'=(.*)$','m')); return m ? m[1].trim() : null; };
process.env.SUPABASE_URL = get('NEXT_PUBLIC_SUPABASE_URL');
process.env.ANON_KEY = get('NEXT_PUBLIC_SUPABASE_ANON_KEY');
process.env.SERVICE_KEY = get('SUPABASE_SERVICE_ROLE_KEY');
console.log('anon len:', (process.env.ANON_KEY||'').length, 'service len:', (process.env.SERVICE_KEY||'').length);

const { createClient } = require('/projects/magnus-site-v2/node_modules/@supabase/supabase-js');

async function main(){
  const anon = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);
  const { data: page, error: pErr } = await anon.from('pages').select('id,slug').eq('slug','home').maybeSingle();
  if(pErr){ console.error('anon page err:', pErr.message); }
  console.log('page via anon:', page);
  if(page){
    const { data: secs, error: sErr } = await anon.from('page_sections').select('id,type,data').eq('page_id',page.id).eq('type','gallery');
    if(sErr){ console.error('anon sec err:', sErr.message); }
    console.log('gallery via anon:', JSON.stringify(secs,null,2));
  }
}
main();
