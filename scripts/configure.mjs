import fs from 'node:fs';
const [repo,origin]=process.argv.slice(2);
if(!/^[\w.-]+\/[\w.-]+$/.test(repo||'')||!origin){console.error('Usage: npm run configure -- USERNAME/REPOSITORY https://PROJECT.pages.dev');process.exit(1)}
const u=new URL(origin);if(u.protocol!=='https:'||u.origin!==origin)throw new Error('Use an HTTPS origin without a trailing slash or path.');
const s=JSON.parse(fs.readFileSync('content/settings.json','utf8'));s.githubRepo=repo;s.siteUrl=origin;fs.writeFileSync('content/settings.json',JSON.stringify(s,null,2)+'\n');console.log('Configured. Run npm run build, then commit and push.');
