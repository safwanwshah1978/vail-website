export async function onRequestGet({request,env}) {
  const headers={'Cache-Control':'no-store','Set-Cookie':'__Host-vail_oauth=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
  const fail=(text,status=400)=>new Response(text,{status,headers});
  if(!env.SITE_ORIGIN||!env.GITHUB_CLIENT_ID||!env.GITHUB_CLIENT_SECRET||!env.GITHUB_REPO)return fail('Editor login has not been configured.',503);
  const origin=new URL(env.SITE_ORIGIN).origin;const u=new URL(request.url);
  if(u.origin!==origin)return fail('Use the configured editor website.',403);
  const cookie=request.headers.get('Cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('__Host-vail_oauth='))?.split('=')[1];
  if(!cookie||!u.searchParams.get('state')||cookie!==u.searchParams.get('state'))return fail('Login expired or invalid. Close this window and try again.');
  const code=u.searchParams.get('code');if(!code)return fail('GitHub authorization was not completed.');
  try {
    const response=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code,redirect_uri:origin+'/api/callback'})});
    const auth=await response.json();if(!response.ok||!auth.access_token)return fail('GitHub login failed. Try again.',502);
    const repo=await fetch('https://api.github.com/repos/'+env.GITHUB_REPO,{headers:{Authorization:'Bearer '+auth.access_token,Accept:'application/vnd.github+json','User-Agent':'vail-editor'}});
    const permission=await repo.json();if(!repo.ok||!permission.permissions?.push)return fail('This GitHub account does not have permission to edit this website.',403);
    const nonce=crypto.randomUUID();
    headers['Content-Type']='text/html; charset=utf-8';headers['Content-Security-Policy']=`default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'`;
    const safe=x=>JSON.stringify(x).replaceAll('<','\\u003c');
    const message='authorization:github:success:'+JSON.stringify({token:auth.access_token,provider:'github'});
    return new Response(`<!doctype html><meta charset="utf-8"><title>Website editor login</title><p>Login complete. This window will close after the editor receives authorization.</p><script nonce="${nonce}">const origin=${safe(origin)};const target=window.opener;if(target){window.addEventListener('message',event=>{if(event.origin===origin&&event.source===target&&event.data==='authorizing:github'){target.postMessage(${safe(message)},origin);window.close();}});target.postMessage('authorizing:github',origin);}</script>`,{headers});
  }catch{return fail('Unable to complete login. Try again shortly.',502)}
}
