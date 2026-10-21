export function enableProtection() {
  // 1. Right Click Disable
  document.addEventListener('contextmenu', e => e.preventDefault());

  // 2. Inspect Keys Disable - F12, Ctrl+Shift+I/J/C, Ctrl+U
  document.addEventListener('keydown', e => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U')
    ) {
      e.preventDefault();
      alert('⚠️ Inspect is disabled for security!');
      return false;
    }
    // PrintScreen detect
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('');
      alert('⚠️ Screenshot disabled!');
    }
  });

  // 3. Text Selection Disable (Optional)
  document.addEventListener('selectstart', e => e.preventDefault());

  // 4. DevTools Open Detect
  setInterval(() => {
    const widthDiff = window.outerWidth - window.innerWidth > 160;
    const heightDiff = window.outerHeight - window.innerHeight > 160;
    if (widthDiff || heightDiff) {
      document.body.innerHTML = '<div style="height:100vh;display:flex;align-items:center;justify-content:center;background:#000;color:#fff;font-size:24px">⚠️ Inspect Detected - Access Denied</div>';
    }
  }, 1000);

  console.log('%c🚫 STOP! This is protected portfolio!', 'color:red;font-size:30px;font-weight:bold;');
}
