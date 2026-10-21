const BACKEND = 'http://localhost:5000';
const FRONTEND = 'http://localhost:5173';

console.log('\n====== FRONTEND AUTO TEST ======\n');
let pass = 0, fail = 0;

async function check(name, url) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      console.log(`✅ ${name} - PASS`);
      pass++;
    } else {
      console.log(`❌ ${name} - FAIL [${res.status}]`);
      fail++;
    }
  } catch {
    console.log(`❌ ${name} - ERROR: Server band hai`);
    fail++;
  }
}

await check('Backend Root', `${BACKEND}/`);
await check('Hero API', `${BACKEND}/api/hero`);
await check('Projects API', `${BACKEND}/api/projects`);
await check('Skills API', `${BACKEND}/api/skills`);
await check('Experience API', `${BACKEND}/api/experience`);
await check('Frontend Home', `${FRONTEND}/`);
await check('Admin Panel', `${FRONTEND}/admin`);

console.log(`\n====== RESULT: ${pass} PASS, ${fail} FAIL ======`);
if (fail === 0) console.log('🎉 FRONTEND READY! Ab data add karo!');
