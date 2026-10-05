const crypto = require('crypto');

const SECRET = process.env.TAYF_DISCORD_GATEWAY_SECRET || '';
const STATE_CHANNEL_ID = process.env.TAYF_STATE_CHANNEL_ID || '';
const STATE_THREAD_ID = process.env.TAYF_STATE_THREAD_ID || '';

function safeEqual(a,b){
  const A=Buffer.from(String(a||'')), B=Buffer.from(String(b||''));
  return A.length===B.length && crypto.timingSafeEqual(A,B);
}
function allowedEndpoint(endpoint,method='GET'){
  try{
    const u=new URL(String(endpoint||''),'https://discord.invalid');
    const p=u.pathname,m=String(method||'GET').toUpperCase();

    // TAYF Discord Data / bot provisioning routes only.
    if(m==='GET' && p==='/users/@me') return true;
    if(m==='GET' && /^\/guilds\/\d+$/.test(p)) return true;
    if(['GET','POST'].includes(m) && /^\/guilds\/\d+\/channels$/.test(p)) return true;
    if(m==='GET' && /^\/guilds\/\d+\/threads\/active$/.test(p)) return true;

    if(['GET','PATCH','DELETE'].includes(m) && /^\/channels\/\d+$/.test(p)) return true;
    if(['GET','POST'].includes(m) && /^\/channels\/\d+\/messages$/.test(p)) return true;
    if(['GET','PATCH','DELETE'].includes(m) && /^\/channels\/\d+\/messages\/\d+$/.test(p)) return true;
    if(m==='GET' && /^\/channels\/\d+\/pins$/.test(p)) return true;
    if(['PUT','DELETE'].includes(m) && /^\/channels\/\d+\/pins\/\d+$/.test(p)) return true;
    if(m==='POST' && /^\/channels\/\d+\/threads$/.test(p)) return true;
    if(m==='GET' && /^\/channels\/\d+\/threads\/archived\/public$/.test(p)) return true;

    return false;
  }catch{return false}
}
async function readBody(req){
  if(req.body && typeof req.body==='object') return req.body;
  if(typeof req.body==='string'){ try{return JSON.parse(req.body)}catch{return {}} }
  const chunks=[]; for await(const chunk of req) chunks.push(chunk);
  if(!chunks.length) return {};
  try{return JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{return {}}
}

module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method==='GET') return res.status(200).json({ok:true,service:'tayf-discord-data-gateway'});

  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const incoming=req.headers['x-tayf-gateway-secret']||'';
  if(!SECRET || !safeEqual(incoming,SECRET)) return res.status(401).json({error:'Unauthorized'});

  const body=await readBody(req);
  const token=String(body.token||'');
  const endpoint=String(body.endpoint||'');
  const method=String(body.method||'GET').toUpperCase();
  if(!token) return res.status(400).json({error:'token required'});
  if(!['GET','POST','PATCH','PUT','DELETE'].includes(method)) return res.status(400).json({error:'method not allowed'});
  if(!allowedEndpoint(endpoint,method)) return res.status(403).json({error:'endpoint not allowed'});

  try{
    const headers={Authorization:'Bot '+token,'Content-Type':'application/json'};
    const upstream=await fetch('https://discord.com/api/v10'+endpoint,{
      method,
      headers,
      body:['GET','HEAD'].includes(method) ? undefined : JSON.stringify(body.json===undefined?{}:body.json),
      signal:AbortSignal.timeout(20000)
    });
    const text=await upstream.text();
    res.status(upstream.status);
    const forwardHeaders=['retry-after','x-ratelimit-scope','x-ratelimit-global','x-ratelimit-limit','x-ratelimit-remaining','x-ratelimit-reset-after','x-ratelimit-bucket','cf-ray'];
    for(const h of forwardHeaders){const v=upstream.headers.get(h);if(v)res.setHeader(h,v)}
    const contentType=upstream.headers.get('content-type')||'';
    if(contentType.includes('application/json')){
      try{return res.json(text?JSON.parse(text):null)}catch{}
    }
    return res.send(text);
  }catch(e){
    return res.status(502).json({error:'Discord gateway request failed'});
  }
}
