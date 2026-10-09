require('dotenv').config();
const express = require('express');
const fs = require('fs');
const os = require('os');
const net = require('net');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = global.fetch || require('node-fetch');

const PORT = +process.env.PORT || 3000;
const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;
const SECRET = process.env.JWT_SECRET || 'dev-secret';
const GH_ID = process.env.GITHUB_CLIENT_ID, GH_SECRET = process.env.GITHUB_CLIENT_SECRET;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const DEP = path.join(__dirname, 'deployments');
fs.mkdirSync(DEP, { recursive: true });
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

// ---------- قاعدة البيانات (ملف JSON) ----------
let db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) : {};
db.users ||= []; db.projects ||= []; db.deployments ||= [];
db.projects.forEach(p => { if (['running', 'building'].includes(p.status)) p.status = 'stopped'; });
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
const rid = () => crypto.randomBytes(6).toString('hex');
save();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- المصادقة ----------
const sign = u => jwt.sign({ uid: u.id }, SECRET, { expiresIn: '30d' });
const pub = u => ({ id: u.id, email: u.email, name: u.name, github: !!u.ghToken, ghLogin: u.ghLogin || null, oauth: !!GH_ID });
const auth = (req, res, next) => {
  try {
    const t = (req.headers.authorization || '').replace('Bearer ', '');
    req.user = db.users.find(u => u.id === jwt.verify(t, SECRET).uid);
    if (!req.user) throw 0; next();
  } catch { res.status(401).json({ error: 'يجب تسجيل الدخول' }); }
};
app.post('/api/auth/register', async (req, res) => {
  const { email = '', password = '', name = '' } = req.body;
  const e = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
  if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب ألا تقل عن 6 أحرف' });
  if (db.users.some(u => u.email === e)) return res.status(409).json({ error: 'هذا البريد مسجل مسبقاً' });
  const u = { id: rid(), email: e, name: name.trim() || e.split('@')[0], hash: await bcrypt.hash(password, 10), createdAt: Date.now() };
  db.users.push(u); save();
  res.json({ token: sign(u), user: pub(u) });
});
app.post('/api/auth/login', async (req, res) => {
  const e = (req.body.email || '').trim().toLowerCase();
  const u = db.users.find(x => x.email === e);
  if (!u || !(await bcrypt.compare(req.body.password || '', u.hash))) return res.status(401).json({ error: 'البريد أو كلمة المرور غير صحيحة' });
  res.json({ token: sign(u), user: pub(u) });
});
app.get('/api/auth/me', auth, (req, res) => res.json(pub(req.user)));

// ---------- GitHub ----------
const gh = (token, url) => fetch('https://api.github.com' + url, { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'vercel-clone', Accept: 'application/vnd.github+json' } });
app.get('/api/github/login-url', auth, (req, res) => {
  if (!GH_ID) return res.status(400).json({ error: 'GITHUB_CLIENT_ID غير مضبوط في .env — استخدم التوكن الشخصي بدلاً منه' });
  const state = jwt.sign({ uid: req.user.id }, SECRET, { expiresIn: '10m' });
  res.json({ url: `https://github.com/login/oauth/authorize?client_id=${GH_ID}&scope=repo&state=${state}&redirect_uri=${encodeURIComponent(BASE + '/api/github/callback')}` });
});
app.get('/api/github/callback', async (req, res) => {
  const fail = m => { console.error('GitHub OAuth فشل:', m); res.redirect('/dashboard.html?github=error&msg=' + encodeURIComponent(m)); };
  try {
    if (req.query.error) return fail(req.query.error_description || req.query.error);
    const { uid } = jwt.verify(req.query.state, SECRET);
    const r = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: GH_ID, client_secret: GH_SECRET, code: req.query.code, redirect_uri: BASE + '/api/github/callback' }) });
    const j = await r.json();
    if (!j.access_token) return fail(j.error_description || j.error || 'لم يُرجع GitHub توكن');
    const mr = await gh(j.access_token, '/user');
    if (!mr.ok) return fail('تعذر قراءة بيانات حسابك من GitHub');
    const u = db.users.find(x => x.id === uid);
    if (!u) return fail('المستخدم غير موجود');
    u.ghToken = j.access_token; u.ghLogin = (await mr.json()).login; save();
    res.redirect('/dashboard.html?github=connected');
  } catch (e) { fail(e.message); }
});
app.post('/api/github/token', auth, async (req, res) => {
  const t = (req.body.token || '').trim();
  const r = await gh(t, '/user');
  if (!r.ok) return res.status(400).json({ error: 'التوكن غير صالح' });
  req.user.ghToken = t; req.user.ghLogin = (await r.json()).login; save();
  res.json(pub(req.user));
});
app.delete('/api/github', auth, (req, res) => { delete req.user.ghToken; delete req.user.ghLogin; save(); res.json(pub(req.user)); });
app.get('/api/github/repos', auth, async (req, res) => {
  if (!req.user.ghToken) return res.status(400).json({ error: 'GitHub غير مربوط' });
  const r = await gh(req.user.ghToken, '/user/repos?per_page=100&sort=pushed');
  if (!r.ok) return res.status(400).json({ error: 'تعذر جلب المستودعات' });
  res.json((await r.json()).map(x => ({ name: x.name, full: x.full_name, url: x.clone_url, branch: x.default_branch, private: x.private, lang: x.language, pushed: x.pushed_at })));
});

// ---------- الكشف الذكي ----------
const DBS = {
  mongoose: ['MongoDB', 'MONGODB_URI'], mongodb: ['MongoDB', 'MONGODB_URI'], pg: ['PostgreSQL', 'DATABASE_URL'], postgres: ['PostgreSQL', 'DATABASE_URL'],
  mysql2: ['MySQL', 'DATABASE_URL'], mysql: ['MySQL', 'DATABASE_URL'], sqlite3: ['SQLite', ''], 'better-sqlite3': ['SQLite', ''], redis: ['Redis', 'REDIS_URL'], ioredis: ['Redis', 'REDIS_URL'],
  '@prisma/client': ['Prisma', 'DATABASE_URL'], sequelize: ['Sequelize', 'DATABASE_URL'], typeorm: ['TypeORM', 'DATABASE_URL'], '@supabase/supabase-js': ['Supabase', 'SUPABASE_URL'],
  firebase: ['Firebase', ''], 'firebase-admin': ['Firebase', ''], '@neondatabase/serverless': ['Neon Postgres', 'DATABASE_URL'], lowdb: ['JSON (lowdb)', ''],
};
function detect(dir) {
  const r = { type: 'unknown', framework: 'غير معروف', installCmd: 'npm install', buildCmd: '', startCmd: 'npm start', dbs: [], envKeys: [], notes: [] };
  const pj = path.join(dir, 'package.json');
  if (fs.existsSync(pj)) {
    const p = JSON.parse(fs.readFileSync(pj, 'utf8')), d = { ...p.dependencies, ...p.devDependencies }, s = p.scripts || {};
    r.type = 'node'; r.framework = 'Node.js';
    if (fs.existsSync(path.join(dir, 'yarn.lock'))) r.installCmd = 'yarn install';
    else if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) r.installCmd = 'pnpm install';
    else if (fs.existsSync(path.join(dir, 'package-lock.json'))) r.installCmd = 'npm ci';
    if (d.next) { r.framework = 'Next.js'; r.buildCmd = 'npm run build'; r.startCmd = 'npm start'; }
    else if (d.nuxt) { r.framework = 'Nuxt'; r.buildCmd = 'npm run build'; r.startCmd = 'node .output/server/index.mjs'; }
    else if (d['react-scripts']) { r.framework = 'Create React App'; r.buildCmd = 'npm run build'; r.startCmd = 'npx serve -s build -l $PORT'; }
    else if (d.vite) { r.framework = 'Vite'; r.buildCmd = 'npm run build'; r.startCmd = 'npx vite preview --host 0.0.0.0 --port $PORT'; }
    else if (d['@nestjs/core']) { r.framework = 'NestJS'; r.buildCmd = 'npm run build'; r.startCmd = 'npm run start:prod'; }
    else if (d.express) { r.framework = 'Express'; }
    else if (d.fastify) { r.framework = 'Fastify'; }
    else if (d.koa) { r.framework = 'Koa'; }
    if (!s.start && r.framework !== 'Create React App' && r.framework !== 'Vite' && r.framework !== 'Nuxt') {
      const m = p.main || ['server.js', 'index.js', 'app.js'].find(f => fs.existsSync(path.join(dir, f)));
      r.startCmd = m ? `node ${m}` : 'npm run dev';
    }
    for (const k of Object.keys(d)) if (DBS[k] && !r.dbs.some(x => x.name === DBS[k][0])) r.dbs.push({ name: DBS[k][0], envKey: DBS[k][1] });
    r.dbs.forEach(x => x.envKey && r.envKeys.push(x.envKey));
  } else if (fs.existsSync(path.join(dir, 'index.html'))) {
    r.type = 'static'; r.framework = 'موقع ثابت (HTML)'; r.installCmd = ''; r.startCmd = 'npx --yes serve -l $PORT .';
  } else if (fs.existsSync(path.join(dir, 'requirements.txt'))) {
    r.type = 'python'; r.framework = 'Python'; r.installCmd = 'pip install -r requirements.txt'; r.startCmd = 'python app.py';
  } else r.notes.push('لم يتم العثور على package.json أو index.html');
  for (const f of ['.env.example', '.env.sample', '.env.template']) {
    const fp = path.join(dir, f);
    if (fs.existsSync(fp)) fs.readFileSync(fp, 'utf8').split('\n').forEach(l => { const k = (l.match(/^\s*([A-Z0-9_]+)\s*=/) || [])[1]; if (k && k !== 'PORT' && !r.envKeys.includes(k)) r.envKeys.push(k); });
  }
  if (r.envKeys.some(k => /DATABASE|DB_|MONGO|POSTGRES|MYSQL|REDIS/.test(k)) && !r.dbs.length) r.dbs.push({ name: 'قاعدة بيانات (من .env.example)', envKey: '' });
  if (fs.readdirSync(dir).some(f => /\.(db|sqlite3?)$/.test(f))) r.notes.push('تم العثور على ملف قاعدة بيانات محلي — سيُفقد عند إعادة النشر، استخدم قاعدة بيانات خارجية.');
  return r;
}
const okRepo = u => /^https:\/\/[\w.-]+\/[\w.\-/]+$/.test(u), okBranch = b => /^[\w./-]+$/.test(b);
const q = s => process.platform === 'win32' ? `"${String(s).replace(/"/g, '""')}"` : `'${String(s).replace(/'/g, `'\\''`)}'`;
const authUrl = (url, u) => u?.ghToken && url.startsWith('https://github.com/') ? url.replace('https://', `https://x-access-token:${u.ghToken}@`) : url;

app.post('/api/detect', auth, async (req, res) => {
  const { repoUrl, branch = 'main', rootDir = '' } = req.body;
  if (!okRepo(repoUrl || '') || !okBranch(branch)) return res.status(400).json({ error: 'رابط المستودع أو الفرع غير صالح' });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'det-'));
  const code = await sh(null, `git clone --depth 1 -b ${q(branch)} ${q(authUrl(repoUrl, req.user))} ${q(tmp + '/r')}`, os.tmpdir(), {}, true);
  if (code) { fs.rmSync(tmp, { recursive: true, force: true }); return res.status(400).json({ error: 'تعذر سحب المستودع — تأكد من الرابط والفرع وصلاحيات الوصول' }); }
  try { res.json(detect(path.join(tmp, 'r', rootDir.replace(/\.\./g, '')))); } catch (e) { res.status(400).json({ error: 'فشل التحليل' }); }
  fs.rmSync(tmp, { recursive: true, force: true });
});

// ---------- تشغيل العمليات والسجلات ----------
const logs = {}, procs = {}, busy = {};
const log = (id, d) => { (logs[id] ||= []).push(...String(d).replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter(Boolean)); if (logs[id].length > 3000) logs[id].splice(0, 500); };
const cleanEnv = extra => { const e = { ...process.env, ...extra }; delete e.JWT_SECRET; delete e.GITHUB_CLIENT_SECRET; return e; };
function sh(pid, cmd, cwd, env, quiet) {
  return new Promise(r => {
    if (pid && !quiet) log(pid, '$ ' + cmd.replace(/x-access-token:[^@]+@/g, ''));
    const c = spawn(cmd, { cwd, shell: true, env: cleanEnv(env) });
    c.stdout.on('data', d => pid && log(pid, d)); c.stderr.on('data', d => pid && log(pid, d));
    c.on('close', r); c.on('error', () => r(1));
  });
}
const killTree = c => { try { process.kill(-c.pid); } catch { try { c.kill(); } catch { } } };
function stop(p) { const c = procs[p.id]; if (c) { delete procs[p.id]; p.status = 'stopped'; killTree(c); } }
const waitPort = (port, ms = 60000) => new Promise(ok => {
  const t0 = Date.now(), tick = () => { const s = net.connect(port, '127.0.0.1'); s.on('connect', () => { s.destroy(); ok(true); }); s.on('error', () => { s.destroy(); Date.now() - t0 > ms ? ok(false) : setTimeout(tick, 800); }); };
  tick();
});
const envOf = p => ({ ...Object.fromEntries((p.env || '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])), PORT: String(p.port) });

async function deploy(p, user) {
  if (busy[p.id]) return; busy[p.id] = true; logs[p.id] = [];
  const d = { id: rid(), projectId: p.id, status: 'building', createdAt: Date.now(), commit: '' };
  db.deployments.unshift(d); db.deployments = db.deployments.slice(0, 300);
  stop(p); p.status = 'building'; save();
  const fail = m => { log(p.id, '✖ ' + m); d.status = 'failed'; p.status = 'failed'; save(); };
  try {
    const dir = path.join(DEP, p.id), env = envOf(p);
    fs.rmSync(dir, { recursive: true, force: true });
    log(p.id, `▲ بدء النشر من ${p.repoUrl} (${p.branch})`);
    if (await sh(p.id, `git clone --depth 1 -b ${q(p.branch)} ${q(authUrl(p.repoUrl, user))} ${q(dir)}`, DEP, env)) return fail('فشل سحب المستودع');
    d.commit = await new Promise(r => { let o = ''; const c = spawn('git', ['rev-parse', '--short', 'HEAD'], { cwd: dir }); c.stdout.on('data', x => o += x); c.on('close', () => r(o.trim())); });
    const cwd = path.join(dir, (p.rootDir || '').replace(/\.\./g, ''));
    if (p.installCmd && await sh(p.id, p.installCmd, cwd, env)) return fail('فشل أمر التثبيت');
    if (p.buildCmd && await sh(p.id, p.buildCmd, cwd, env)) return fail('فشل أمر البناء');
    log(p.id, '$ ' + p.startCmd);
    const c = spawn(p.startCmd, { cwd, shell: true, detached: true, env: cleanEnv({ ...env, NODE_ENV: env.NODE_ENV || 'production' }) });
    procs[p.id] = c; p.status = 'running';
    c.stdout.on('data', x => log(p.id, x)); c.stderr.on('data', x => log(p.id, x));
    c.on('close', code => { if (procs[p.id] === c) { delete procs[p.id]; p.status = code ? 'failed' : 'stopped'; log(p.id, `■ توقفت العملية (code ${code})`); save(); } });
    if (await waitPort(p.port)) {
      d.status = 'ready';
      const defaultUrl = `http://localhost:${p.port}`;
      const custom = (p.customDomain || '').trim();
      p.url = custom ? (custom.startsWith('http://') || custom.startsWith('https://') ? custom : `http://${custom}`) : defaultUrl;
      p.lastDeployAt = Date.now();
      log(p.id, `✔ جاهز على ${p.url}`);
    }
    else { stop(p); return fail(`التطبيق لم يستمع على المنفذ ${p.port}. تأكد أنه يقرأ process.env.PORT`); }
    save();
  } catch (e) { fail(e.message); } finally { busy[p.id] = false; }
}

// ---------- المشاريع ----------
const mine = (req, res) => { const p = db.projects.find(x => x.id === req.params.id && x.userId === req.user.id); if (!p) res.status(404).json({ error: 'المشروع غير موجود' }); return p; };
const FIELDS = ['name', 'repoUrl', 'branch', 'rootDir', 'installCmd', 'buildCmd', 'startCmd', 'env', 'autoDeploy', 'framework', 'dbs', 'customDomain'];
const formatUrl = (custom, hostname, port) => {
  if (custom && custom.trim()) {
    const c = custom.trim();
    return c.startsWith('http://') || c.startsWith('https://') ? c : `http://${c}`;
  }
  return `http://${hostname || 'localhost'}:${port}`;
};
const view = (req, p) => {
  const resolvedUrl = formatUrl(p.customDomain, req.hostname, p.port);
  return {
    ...p,
    webhook: `${BASE}/api/webhook/${p.id}/${p.webhookSecret}`,
    webhookSecret: undefined,
    deployments: db.deployments.filter(d => d.projectId === p.id).slice(0, 10),
    url: p.status === 'running' ? resolvedUrl : null,
    previewUrl: resolvedUrl,
    customDomain: p.customDomain || ''
  };
};
function nextPort() { const used = new Set(db.projects.map(p => p.port)); let n = +process.env.PROJECT_PORT_START || 4000; while (used.has(n)) n++; return n; }
app.get('/api/projects', auth, (req, res) => res.json(db.projects.filter(p => p.userId === req.user.id).map(p => view(req, p))));
app.post('/api/projects', auth, (req, res) => {
  const b = req.body;
  if (!okRepo(b.repoUrl || '') || !okBranch(b.branch || 'main')) return res.status(400).json({ error: 'رابط المستودع أو الفرع غير صالح' });
  const slug = (b.name || b.repoUrl.split('/').pop()).replace(/\.git$/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 40);
  const p = { id: rid(), userId: req.user.id, status: 'idle', port: nextPort(), webhookSecret: rid() + rid(), createdAt: Date.now(), branch: 'main', rootDir: '', env: '', autoDeploy: true, ...Object.fromEntries(FIELDS.filter(k => b[k] !== undefined).map(k => [k, b[k]])), name: slug };
  db.projects.push(p); save(); res.json(view(req, p));
  if (b.deployNow !== false) deploy(p, req.user);
});
app.get('/api/projects/:id', auth, (req, res) => { const p = mine(req, res); if (p) res.json(view(req, p)); });
app.put('/api/projects/:id', auth, (req, res) => {
  const p = mine(req, res); if (!p) return;
  if (req.body.branch && !okBranch(req.body.branch)) return res.status(400).json({ error: 'اسم الفرع غير صالح' });
  FIELDS.filter(k => k !== 'repoUrl' && req.body[k] !== undefined).forEach(k => p[k] = req.body[k]); save(); res.json(view(req, p));
});
app.post('/api/projects/:id/deploy', auth, (req, res) => { const p = mine(req, res); if (!p) return; deploy(p, req.user); res.json({ ok: true }); });
app.post('/api/projects/:id/stop', auth, (req, res) => { const p = mine(req, res); if (!p) return; stop(p); save(); res.json(view(req, p)); });
app.delete('/api/projects/:id', auth, (req, res) => {
  const p = mine(req, res); if (!p) return; stop(p);
  fs.rmSync(path.join(DEP, p.id), { recursive: true, force: true });
  db.projects = db.projects.filter(x => x !== p); db.deployments = db.deployments.filter(d => d.projectId !== p.id); delete logs[p.id]; save(); res.json({ ok: true });
});
const listFiles = (dir, rel = '') => { try { return fs.readdirSync(dir, { withFileTypes: true }).filter(d => !['.git', 'node_modules'].includes(d.name)).flatMap(d => d.isDirectory() ? listFiles(path.join(dir, d.name), path.join(rel, d.name)) : [path.join(rel, d.name).replace(/\\/g, '/')]); } catch { return []; } };
app.get('/api/projects/:id/files', auth, (req, res) => {
  const p = mine(req, res); if (!p) return;
  res.json(listFiles(path.join(DEP, p.id)));
});
app.get('/api/projects/:id/logs', auth, (req, res) => {
  const p = mine(req, res); if (!p) return; const l = logs[p.id] || [], since = +req.query.since || 0;
  const resolvedUrl = formatUrl(p.customDomain, req.hostname, p.port);
  res.json({ lines: l.slice(since), next: l.length, status: p.status, url: p.status === 'running' ? resolvedUrl : null, previewUrl: resolvedUrl });
});
app.post('/api/webhook/:id/:secret', (req, res) => {
  const p = db.projects.find(x => x.id === req.params.id);
  if (!p || p.webhookSecret !== req.params.secret) return res.status(403).json({ error: 'forbidden' });
  if (p.autoDeploy) deploy(p, db.users.find(u => u.id === p.userId)); res.json({ ok: true });
});
app.delete('/api/deployments/:id', auth, (req, res) => {
  const d = db.deployments.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'غير موجود' });
  const p = db.projects.find(x => x.id === d.projectId);
  if (!p || p.userId !== req.user.id) return res.status(403).json({ error: 'ممنوع' });
  db.deployments = db.deployments.filter(x => x.id !== req.params.id);
  save(); res.json({ ok: true });
});

app.get('/api/stats', auth, (req, res) => {
  const memTotal = os.totalmem(), memFree = os.freemem();
  res.json({
    projects: db.projects.length,
    deployments: db.deployments.length,
    users: db.users.length,
    cpu: os.cpus()[0].model,
    ram: `${((memTotal - memFree) / (1024 ** 3)).toFixed(1)} / ${(memTotal / (1024 ** 3)).toFixed(1)} GB`,
    uptime: Math.floor(process.uptime() / 60) + ' min',
    os: `${os.type()} ${os.arch()}`
  });
});

// Vercel يتطلب تصدير التطبيق
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => { console.log(`\n  ▲ Deploy platform running → ${BASE}`); console.log(`  GitHub OAuth: ${GH_ID && GH_SECRET ? 'مفعّل' : 'غير مضبوط (استخدم التوكن الشخصي)'}\n`); });
  process.on('SIGINT', () => { Object.values(procs).forEach(killTree); process.exit(); });
}