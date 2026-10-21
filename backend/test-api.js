import axios from "axios";

const BASE = "http://localhost:5000/api";

// public aur protected alag
const publicEndpoints = ["/hero", "/about", "/projects", "/skills", "/experience", "/education"];
const protectedEndpoints = ["/messages"];

console.log("🚀 Backend Quick API Test...\n");
let fail = 0;

for (const ep of publicEndpoints) {
  try {
    const res = await axios.get(BASE + ep, { timeout: 3000 });
    console.log(`✅ ${ep} → ${res.status} OK`);
  } catch (err) {
    fail++;
    console.log(`❌ ${ep} → FAIL ${err.response?.status}`);
  }
}

for (const ep of protectedEndpoints) {
  try {
    const res = await axios.get(BASE + ep, { timeout: 3000 });
    console.log(`⚠️ ${ep} → ${res.status} (should be 401, check auth)`);
  } catch (err) {
    if (err.response?.status === 401) {
      console.log(`✅ ${ep} → 401 Protected (Auth Working - OK!)`);
    } else {
      fail++;
      console.log(`❌ ${ep} → ${err.response?.status}`);
    }
  }
}

console.log("\n---------------------------");
if (fail === 0) console.log("🎉 Backend 100% OK - Ready for data!");
else console.log(`⚠️ ${fail} fail!`);