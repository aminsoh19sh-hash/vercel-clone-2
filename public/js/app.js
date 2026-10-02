const API = {
  token: () => localStorage.getItem('token'),
  async req(method, url, body) {
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json', ...(API.token() && { Authorization: 'Bearer ' + API.token() }) }, body: body && JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401 && !location.pathname.includes('login')) { localStorage.removeItem('token'); location.href = 'login.html'; }
    if (!r.ok) throw new Error(d.error || (window.I18N ? I18N.t('errUnexpected') : 'An unexpected error occurred'));
    return d;
  },
  get: u => API.req('GET', u), post: (u, b) => API.req('POST', u, b || {}), put: (u, b) => API.req('PUT', u, b), del: u => API.req('DELETE', u),
};
function toast(m, ms = 2600) { const t = Object.assign(document.createElement('div'), { className: 'toast', textContent: m }); document.body.append(t); setTimeout(() => t.remove(), ms); }
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// الصفحة الرئيسية: تحديث الشريط + محاكاة نشر مباشر
const dashBtn = () => '<a href="dashboard.html" class="btn pri sm">' + (window.I18N ? I18N.t('navDashboard') : 'Dashboard') + '</a>';
if (document.getElementById('nav') && API.token()) document.getElementById('nav').innerHTML = dashBtn();

const t = document.getElementById('t');
let termTimer;
function runTerm() {
  if (!t) return;
  clearTimeout(termTimer);
  t.innerHTML = '';
  const tr = k => (window.I18N ? I18N.t(k) : k);
  const L = [
    '<span class="m">$</span> deployly import <span class="a">acme/store-api</span>',
    '<span class="g">✔</span> ' + tr('termDetected') + ' <span class="a">Express</span> + <span class="g">PostgreSQL</span>',
    '<span class="m">$</span> npm install',
    '<span class="m">added 142 packages in 6s</span>',
    '<span class="m">$</span> npm start',
    '<span class="w">●</span> ' + tr('termListening'),
    '<span class="g">✔ ' + tr('termReady') + '</span> http://localhost:4001'
  ];
  let i = 0;
  (function n() { if (i < L.length) { t.innerHTML += L[i++] + '\n'; termTimer = setTimeout(n, 700); } })();
}
runTerm();

// تحديث العناصر الديناميكية عند تبديل اللغة
window.addEventListener('languageChanged', () => {
  if (document.getElementById('nav') && API.token()) document.getElementById('nav').innerHTML = dashBtn();
  runTerm();
});