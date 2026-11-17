const FRONTEND = 'http://localhost:5173';
let pass = 0, fail = 0;
async function check(name, url) {
  try {
    const res = await fetch(url);
    if (res.ok) { console.log('✅ ' + name + ' - PASS'); pass++; }
    else { console.log('❌ ' + name + ' - FAIL [' + res.status + ']'); fail++; }
  } catch { console.log('❌ ' + name + ' - ERROR'); fail++; }
}
(async () => {
  await check('Home', FRONTEND + '/');
  await check('About', FRONTEND + '/about');
  await check('Projects', FRONTEND + '/projects');
  await check('Profile', FRONTEND + '/profile.jpg');
  await check('CV', FRONTEND + '/resume.pdf');
  await check('Project 1', FRONTEND + '/projects/CivicPulse.jpg');
  await check('Project 2', FRONTEND + '/projects/project-management-tool.jpg');
  await check('Project 3', FRONTEND + '/projects/bus-tracking-booking-app.jpg');
  console.log('RESULT: ' + pass + ' PASS, ' + fail + ' FAIL');
})();