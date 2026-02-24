// ── STATE ──
let currentCat  = 'mods';
let searchQuery = '';

// ── INIT ──
window.addEventListener('load', () => {
  initWidget();
  
  // Restore Theme
  const savedTheme = localStorage.getItem('lh_theme') || CONFIG.defaultTheme;
  if(savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-icon').textContent = savedTheme === 'light' ? '☾' : '☀';
    document.getElementById('theme-switch').checked = savedTheme !== 'light';
  }

  // Check Auth
  checkAuth();
  initCanvas();
  updateCounts();
  render();
});

// ── RENDER ENGINE ──
function levenshtein(a, b) {
  const matrix = [];
  for(let i=0; i<=b.length; i++) matrix[i] = [i];
  for(let j=0; j<=a.length; j++) matrix[0][j] = j;
  for(let i=1; i<=b.length; i++){
    for(let j=1; j<=a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)) matrix[i][j] = matrix[i-1][j-1];
      else matrix[i][j] = Math.min(matrix[i-1][j-1]+1, Math.min(matrix[i][j-1]+1, matrix[i-1][j]+1));
    }
  }
  return matrix[b.length][a.length];
}

function getItems(cat, q) {
  return DB.filter(item => {
    const catMatch = item.cats.includes(cat);
    if (!catMatch) return false;
    if (!q) return true;
    
    const ql = q.toLowerCase();
    const name = item.name.toLowerCase();
    const desc = (item.desc || '').toLowerCase();
    
    if (name.includes(ql) || desc.includes(ql)) return true;
    
    const threshold = Math.floor(ql.length / 3) + 1; 
    const dist = levenshtein(ql, name.substring(0, Math.max(ql.length, name.length)));
    return dist <= threshold;
  });
}

function render() {
  const items    = getItems(currentCat, searchQuery);
  const container= document.getElementById('cards');
  const meta     = CATS[currentCat] || { title: currentCat, sub: '' };

  document.getElementById('page-title').textContent  = meta.title;
  document.getElementById('page-sub').textContent    = meta.sub;
  document.getElementById('page-count').textContent  = items.length + ' записей';

  if (!items.length) {
    container.innerHTML = `<div class="empty"><div class="empty-ico">◻</div><p>Записей нет.</p></div>`;
    return;
  }

  container.innerHTML = '';
  items.forEach((item, i) => {
    const el = buildCard(item);
    el.style.animationDelay = (i * 35) + 'ms';
    container.appendChild(el);
  });
}

function buildCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const chips = (item.chips||[]).map(c => `<span class="chip ${c.cls}">${c.text}</span>`).join('');
  const dotCls = { green: 'dot-g', yellow: 'dot-y', red: 'dot-r' }[item.status] || 'dot-y';

  const hasTabs   = item.steps?.length || item.code || item.links?.length;
  const tabsHTML  = hasTabs ? buildTabs(item) : '';
  const infoHTML  = buildInfo(item, dotCls);

  let imgHTML = '';
  if (item.image) {
    imgHTML = `<img class="c-img" src="${item.image}" alt="${item.name}" loading="lazy">`;
  }

  card.innerHTML = `
    <div class="ch" onclick="onCardClick(this.parentElement, '${item.id}')">
      <div class="ce">${item.emoji||'▪'}</div>
      <div class="ci">
        <div class="cn">${item.name}</div>
        <div class="cc">${chips}</div>
      </div>
      <div class="ct">▾</div>
    </div>
    <div class="cb-wrap">
      ${imgHTML}
      ${infoHTML}
      ${tabsHTML}
    </div>`;

  return card;
}

function buildInfo(item, dotCls) {
  const src = item.source
    ? `<a href="${item.source}" target="_blank">${item.source.replace(/https?:\/\//,'')}</a>`
    : '—';

  return `
    <div style="padding:14px 14px 0;display:flex;flex-direction:column;gap:10px">
      <div class="ig">
        <div class="ib"><div class="il">Версия</div><div class="iv">${item.version||'—'}</div></div>
        <div class="ib"><div class="il">Источник</div><div class="iv">${src}</div></div>
        <div class="ib">
          <div class="il">Статус</div>
          <div class="status"><div class="dot ${dotCls}"></div><span class="sl">${item.statusText||'—'}</span></div>
        </div>
      </div>
    </div>`;
}

function buildTabs(item) {
  let tabs = '', panels = '', first = true;

  if (item.desc) {
    tabs   += `<div class="tab${first?' active':''}" onclick="switchTab(this,'tp-desc-${item.id}')">📄 Описание</div>`;
    panels += `<div class="tp${first?' active':''}" id="tp-desc-${item.id}"><div class="desc">${item.desc}</div></div>`;
    first   = false;
  }
  if (item.steps?.length) {
    tabs   += `<div class="tab${first?' active':''}" onclick="switchTab(this,'tp-steps-${item.id}')">📋 Установка</div>`;
    const stepsHTML = item.steps.map((s,i) => `<div class="step"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`).join('');
    panels += `<div class="tp${first?' active':''}" id="tp-steps-${item.id}"><div class="steps">${stepsHTML}</div></div>`;
    first   = false;
  }
  if (item.code) {
    const eid = 'code-' + item.id;
    tabs   += `<div class="tab${first?' active':''}" onclick="switchTab(this,'tp-code-${item.id}')">💻 Код</div>`;
    panels += `<div class="tp${first?' active':''}" id="tp-code-${item.id}"><div class="code-block"><div class="code-head"><span class="code-lang">${item.code.lang}</span><button class="copy-btn" onclick="copyCode('${eid}',this)">Копировать</button></div><pre><code id="${eid}">${escHtml(item.code.text.trim())}</code></pre></div></div>`;
    first = false;
  }
  if (item.links?.length) {
    tabs   += `<div class="tab${first?' active':''}" onclick="switchTab(this,'tp-links-${item.id}')">🔗 Ссылки</div>`;
    const linksHTML = item.links.map(l => `<a class="link-item" href="${l.url}" target="_blank"><span class="li-ico">${l.ico||'🔗'}</span><div class="li-body"><div class="li-name">${l.name}</div>${l.desc ? `<div class="li-desc">${l.desc}</div>` : ''}<div class="li-url">${l.url.replace(/https?:\/\//,'')}</div></div><span class="li-arrow">↗</span></a>`).join('');
    panels += `<div class="tp${first?' active':''}" id="tp-links-${item.id}"><div class="links-list">${linksHTML}</div></div>`;
  }
  return `<div class="tabs" style="margin-top:10px">${tabs}</div><div style="padding:0">${panels}</div>`;
}

// ── HELPERS ──
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function onCardClick(card, id) {
  card.classList.toggle('open');
  let user = JSON.parse(localStorage.getItem('lh_user'));
  if (user) {
    if (!user.viewed) user.viewed = [];
    if (!user.viewed.includes(id)) {
      user.viewed.push(id);
      localStorage.setItem('lh_user', JSON.stringify(user));
      addXP(15, 'Новый материал изучен');
      updateDashboard(user);
    }
  }
}
function switchTab(tab, panelId) {
  const card = tab.closest('.card');
  card.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  card.querySelectorAll('.tp').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(panelId)?.classList.add('active');
}
function copyCode(id, btn) {
  const code = document.getElementById(id)?.textContent || '';
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '✓ Скопировано';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Копировать'; btn.classList.remove('copied'); }, 2000);
  });
  addXP(15, 'Код скопирован');
}
function go(cat, el) {
  currentCat = cat;
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  render();
}
function toggleNG(title) { title.parentElement.classList.toggle('open'); }
function doSearch(q) { searchQuery = q; render(); }
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('show');
  document.querySelector('.sidebar-overlay').classList.toggle('show');
}
function updateCounts() {
  Object.keys(CATS).forEach(cat => {
    const el = document.getElementById('nb-' + cat);
    if (el) el.textContent = DB.filter(i => i.cats.includes(cat)).length;
  });
  document.getElementById('d-total').textContent = DB.length;
}

// ── AUTH & SYSTEM ──
function toggleTheme() {
  const root = document.documentElement;
  const isLight = root.getAttribute('data-theme') === 'light';
  const newTheme = isLight ? 'dark' : 'light';
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('lh_theme', newTheme);
  document.getElementById('theme-icon').textContent = isLight ? '☀' : '☾';
  document.getElementById('theme-switch').checked = !isLight;
}
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('lh_user'));
  if (user) { initUser(user); hidePreloader(); } 
  else { document.getElementById('auth-overlay').style.display = 'flex'; hidePreloader(); }
}
function hidePreloader() {
  setTimeout(() => {
    const pl = document.getElementById('preloader');
    pl.style.opacity = '0';
    pl.style.visibility = 'hidden';
  }, 1000);
}
function tryLogin() {
  const inp = document.getElementById('auth-pass');
  const code = inp.value;
  if (CONFIG.accessCodes.includes(code)) {
    localStorage.setItem('lh_user', JSON.stringify(CONFIG.guestUser));
    initUser(CONFIG.guestUser);
    document.getElementById('auth-overlay').style.display = 'none';
    showToast('Доступ разрешен', 'Добро пожаловать в систему', 0);
  } else {
    const msg = document.getElementById('auth-msg');
    msg.classList.add('vis');
    inp.style.borderColor = '#f87171';
    setTimeout(() => { msg.classList.remove('vis'); inp.style.borderColor = ''; }, 2000);
  }
}
function initUser(user) {
  document.getElementById('user-avatar').src = user.avatar || CONFIG.guestUser.avatar;
  updateDashboard(user);
}
function logout() { localStorage.removeItem('lh_user'); location.reload(); }
function openProfile() {
  const user = JSON.parse(localStorage.getItem('lh_user')) || CONFIG.guestUser;
  document.getElementById('p-edit-img').src = user.avatar;
  document.getElementById('p-edit-name').value = user.name;
  document.getElementById('p-edit-bio').value = user.bio || '';
  document.getElementById('p-edit-lvl').textContent = user.level;
  document.getElementById('p-edit-xp').textContent = user.xp;
  const lvl = user.level;
  const currentBase = (lvl-1)*(lvl-1)*10;
  const nextBase = lvl*lvl*10;
  const percent = Math.min(100, Math.max(0, ((user.xp - currentBase) / (nextBase - currentBase)) * 100));
  document.getElementById('p-xp-bar').style.width = percent + '%';
  document.getElementById('profile-modal').classList.add('open');
}
function closeProfile() { document.getElementById('profile-modal').classList.remove('open'); }
function saveProfile() {
  let user = JSON.parse(localStorage.getItem('lh_user')) || CONFIG.guestUser;
  user.name = document.getElementById('p-edit-name').value;
  user.bio = document.getElementById('p-edit-bio').value;
  user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=c8f135&color=000&rounded=true`;
  localStorage.setItem('lh_user', JSON.stringify(user));
  initUser(user);
  closeProfile();
  showToast('Профиль сохранен', 'Данные успешно обновлены', 0);
}
function updateDashboard(user) {
  if(!user) return;
  document.getElementById('d-lvl').textContent = user.level || 1;
  document.getElementById('d-xp').textContent = user.xp || 0;
  document.getElementById('d-viewed').textContent = user.viewed ? user.viewed.length : 0;
}
document.getElementById('auth-pass').addEventListener('keyup', e => { if(e.key === 'Enter') tryLogin(); });
function toggleFX() { document.body.classList.toggle('crt'); }
function addXP(amount, reason) {
  let user = JSON.parse(localStorage.getItem('lh_user'));
  if(!user) return;
  user.xp += amount;
  const newLevel = Math.floor(Math.sqrt(user.xp / 10)) + 1;
  if(newLevel > user.level) {
    showToast('LEVEL UP!', `Вы достигли уровня ${newLevel}`, 0);
    user.level = newLevel;
  } else {
    showToast('XP Получено', reason, amount);
  }
  localStorage.setItem('lh_user', JSON.stringify(user));
  updateDashboard(user);
  if(document.getElementById('profile-modal').classList.contains('open')) openProfile();
}
function showToast(title, desc, xp) {
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="toast-icon">✨</div><div class="toast-body"><div class="toast-title">${title}</div><div class="toast-desc">${desc}</div></div>${xp > 0 ? `<div class="toast-xp">+${xp} XP</div>` : ''}`;
  c.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; setTimeout(()=>el.remove(),300) }, 3000);
}
function initCanvas() {
  const cvs = document.getElementById('bg-canvas');
  const ctx = cvs.getContext('2d');
  let w, h, nodes = [];
  const resize = () => { w = cvs.width = window.innerWidth; h = cvs.height = window.innerHeight; };
  window.addEventListener('resize', resize);
  resize();
  class Node {
    constructor() { this.x = Math.random()*w; this.y = Math.random()*h; this.vx = (Math.random()-0.5)*1.5; this.vy = (Math.random()-0.5)*1.5; this.size = Math.random()*2+1; }
    update() { this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>w)this.vx*=-1; if(this.y<0||this.y>h)this.vy*=-1; }
  }
  for(let i=0; i<60; i++) nodes.push(new Node());
  function loop() {
    ctx.clearRect(0,0,w,h);
    const style = getComputedStyle(document.documentElement);
    const acc = style.getPropertyValue('--acc').trim();
    const isLight = style.getPropertyValue('--bg').includes('#f');
    ctx.fillStyle = acc; ctx.strokeStyle = acc;
    nodes.forEach(node => {
      node.update();
      ctx.globalAlpha = isLight ? 0.3 : 0.15; ctx.beginPath(); ctx.arc(node.x, node.y, node.size, 0, Math.PI*2); ctx.fill();
      nodes.forEach(node2 => {
        const dist = Math.sqrt((node.x-node2.x)**2 + (node.y-node2.y)**2);
        if(dist < 120) { ctx.globalAlpha = (1-dist/120)*(isLight?0.2:0.1); ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(node2.x, node2.y); ctx.stroke(); }
      });
    });
    requestAnimationFrame(loop);
  }
  loop();
}
function initWidget() {
  const graph = document.getElementById('sys-graph');
  const cpu = document.getElementById('sys-cpu');
  for(let i=0; i<10; i++) { const b = document.createElement('div'); b.className = 'sys-bar'; graph.appendChild(b); }
  setInterval(() => {
    document.querySelectorAll('.sys-bar').forEach(b => { const h = Math.random()*100; b.style.height = h+'%'; b.style.opacity = (h/100)*0.8+0.2; });
    cpu.textContent = Math.floor(Math.random()*30+10)+'%';
  }, 800);
}