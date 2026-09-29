export async function onRequestGet({request,env}) {
  if(!env.GITHUB_CLIENT_ID||!env.SITE_ORIGIN)return new Response('Editor login has not been configured.',{status:503});
  const origin=new URL(env.SITE_ORIGIN).origin;
  if(new URL(request.url).origin!==origin)return new Response('Use the configured editor website.',{status:403});
  const state=crypto.randomUUID();
  const u=new URL('https://github.com/login/oauth/authorize');
  u.search=new URLSearchParams({client_id:env.GITHUB_CLIENT_ID,redirect_uri:origin+'/api/callback',scope:'public_repo',state}).toString();
  return new Response(null,{status:302,headers:{Location:u.href,'Set-Cookie':`__Host-vail_oauth=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,'Cache-Control':'no-store'}});
}
