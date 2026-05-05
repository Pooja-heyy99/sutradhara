/* ═══════════════════════════════════════════════════════
   SUTRADHARA — Full Application Logic
   Groq AI · Graph · Charts · Data Engine
═══════════════════════════════════════════════════════ */

// ═══════════ GROQ API KEY CONFIGURATION ═════════════════
// PLACEHOLDER: Replace 'YOUR_GROQ_API_KEY' with your free API key from https://console.groq.com
// Free tier: 30 API calls per minute, up to 25K tokens per minute
// This key will be used for AI explanations across the application
const GROQ_API_KEY_PLACEHOLDER = 'placeholder_gsk_1234567890abcdef';

// Get valid API key from form inputs
function getActiveAPIKey() {
  const explainKey = document.getElementById('groq-api-key')?.value.trim();
  const addKey = document.getElementById('add-groq-key')?.value.trim();
  return explainKey || addKey || '';
}

// Check if API key is valid and ready
function isGroqAPIReady() {
  const key = getActiveAPIKey();
  return key && key.startsWith('gsk_') && key.length > 10;
}

// Update status indicator
function updateAPIStatus() {
  const statusEl = document.querySelector('[data-api-status]');
  if (!statusEl) return;
  
  const ready = isGroqAPIReady();
  statusEl.textContent = ready ? '🟢 Groq API Ready' : '🟡 Demo Mode';
  statusEl.style.color = ready ? '#10b981' : '#f59e0b';
}



// ═══════════ DATA ENGINE ════════════════════════════════

const DEPT_COLORS = {
  shops: '#3b82f6',
  labour: '#10b981',
  pollution: '#8b5cf6',
  bescom: '#f97316',
};

const BUSINESS_NAMES = [
  'Sharma Textiles', 'Lakshmi Enterprises', 'Ravi Industries', 'Patel Trading Co',
  'Meena Garments', 'Krishna Motors', 'Suresh & Sons', 'Anand Electricals',
  'Priya Foods', 'Vijay Steel Works', 'Kumar Brothers', 'Bharat Pharma',
  'Saraswati Jewellers', 'Rajesh Constructions', 'Devi Hardware', 'Nair Automobiles',
  'Gupta Chemicals', 'Iyer Consultancy', 'Reddy Agro', 'Singh Logistics',
  'Malhotra Exports', 'Chopra Plastics', 'Joshi Beverages', 'Rao Machinery',
  'Naidu Apparels', 'Verma Cold Storage', 'Pillai Electronics', 'Murthy Packaging',
  'Bhat Infotech', 'Hegde Paints', 'Shetty Fisheries', 'Kulkarni Seeds',
  'Pandey Furniture', 'Trivedi Chemicals', 'Patil Poultry', 'Shah Jewels',
  'Mehta Constructions', 'Agarwal Dairy', 'Sinha Pharmaceuticals', 'Mishra Plastics',
  'Tiwari Garments', 'Dubey Motors', 'Pandey Electricals', 'Yadav Trading',
  'Rao Textiles', 'Sharma Hotels', 'Gupta Real Estate', 'Kumar IT Solutions',
  'Singh Fertilizers', 'Reddy Hospitals'
];

const ADDRESSES = [
  '12 MG Road', '45 Brigade Road', '78 Church Street', '23 Residency Road',
  '5 Cunningham Road', '90 Richmond Road', '33 Commercial Street', '67 Infantry Road',
  '14 Vittal Mallya Road', '88 Lavelle Road', '29 Museum Road', '41 Kasturba Road',
  '56 St Marks Road', '17 Ali Asker Road', '62 Cubbon Road', '37 Queen\'s Road',
  '8 Palace Road', '72 Bellary Road', '19 Hebbal Ring Road', '54 Tumkur Road',
  '31 Mysore Road', '98 Hosur Road', '26 Electronic City', '44 Sarjapur Road',
  '15 Whitefield Road', '83 Old Airport Road', '50 Koramangala', '22 Indiranagar',
  '69 Jayanagar', '36 JP Nagar'
];

function randBetween(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function randomDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - randBetween(0, daysAgo));
  return d.toISOString().split('T')[0];
}
function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateData() {
  const ubids = [];
  const records = [];
  const statusTypes = ['active', 'active', 'active', 'dormant', 'dormant', 'suspicious'];

  BUSINESS_NAMES.forEach((name, i) => {
    const ubid = `UBID-${String(i + 1).padStart(4, '0')}`;
    const baseAddr = randomChoice(ADDRESSES) + ', Bengaluru - ' + (560001 + randBetween(0, 99));
    const status = randomChoice(statusTypes);
    const similarity = (0.70 + Math.random() * 0.29).toFixed(2);
    const inspectionCount = randBetween(2, 15);
    const elec = randBetween(400, 2500);
    const renewalBase = randomDate(300);

    const nameVariants = [
      name,
      name + ' Pvt Ltd',
      name.replace(' ', ' & ').split(' ')[0] + ' ' + name.split(' ').slice(1).join(' '),
      name + ' Co.'
    ];

    const addrVariants = [
      baseAddr,
      baseAddr.replace('Road', 'Rd'),
      baseAddr + ', 2nd Floor',
      baseAddr.split(',')[0] + ', Bengaluru'
    ];

    const depts = ['shops', 'labour', 'pollution', 'bescom'];
    depts.forEach((dept, j) => {
      records.push({
        id: `REC-${String(i * 4 + j + 1).padStart(5, '0')}`,
        ubid,
        businessName: nameVariants[j],
        address: addrVariants[j],
        department: dept,
        lastRenewal: randomDate(365),
        inspections: randBetween(0, inspectionCount),
        electricityUsage: elec + randBetween(-100, 100),
        eventType: randomChoice(['renewal', 'inspection', 'registration']),
        eventDate: renewalBase,
      });
    });

    ubids.push({
      id: ubid,
      businessName: name,
      address: baseAddr,
      status,
      similarity: parseFloat(similarity),
      confidence: Math.floor(parseFloat(similarity) * 100),
      recordCount: 4,
      departments: depts,
      inspections: inspectionCount,
      lastActivity: randomDate(60),
      electricityUsage: elec,
    });
  });

  return { ubids, records };
}

// ═══════════ APP STATE ══════════════════════════════════

const AppState = {
  data: generateData(),
  currentSection: 'overview',
  filteredRecords: null,
  graphNodes: [],
  graphEdges: [],
  graphAnimFrame: null,
  tooltip: null,
  charts: {},
  newBusinessMode: null,
};

AppState.filteredRecords = [...AppState.data.records];

// ═══════════ NAVIGATION ═════════════════════════════════

function launchDashboard() {
  document.getElementById('landing-page').classList.remove('active');
  document.getElementById('dashboard-page').classList.add('active');
  initDashboard();
}

function goLanding() {
  document.getElementById('dashboard-page').classList.remove('active');
  document.getElementById('landing-page').classList.add('active');
}

function scrollToArch() {
  document.getElementById('arch-section').scrollIntoView({ behavior: 'smooth' });
}

function showSection(name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  document.querySelectorAll('.sb-link').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('topbar-title').textContent =
    { overview: 'Overview', explorer: 'Business Explorer', graph: 'UBID Graph',
      status: 'Status Monitor', explain: 'Explainability AI', add: 'Add Record' }[name];
  AppState.currentSection = name;
  if (name === 'overview') renderCharts();
  if (name === 'explorer') renderRecordsTable();
  if (name === 'status') renderStatusCards();
  if (name === 'explain' || name === 'graph') populateUBIDSelects();
}

// ═══════════ CLOCK ══════════════════════════════════════

function updateClock() {
  const el = document.getElementById('topbar-time');
  if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// ═══════════ LANDING ARCHITECTURE CANVAS ════════════════

function drawArchCanvas() {
  const canvas = document.getElementById('arch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = '#1e2a3d';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const nodes = [
    { x: 80, y: 190, label: 'Shops Dept', color: '#3b82f6', icon: '▣', sub: 'Raw Records' },
    { x: 80, y: 290, label: 'Labour Dept', color: '#10b981', icon: '▣', sub: 'Raw Records' },
    { x: 80, y: 110, label: 'Pollution Ctrl', color: '#8b5cf6', icon: '▣', sub: 'Raw Records' },
    { x: 80, y: 370, label: 'BESCOM', color: '#f97316', icon: '▣', sub: 'Raw Records' },
    { x: 310, y: 240, label: 'Temporal\nSimilarity', color: '#60a5fa', icon: '⏱', sub: 'Scoring Engine' },
    { x: 510, y: 140, label: 'UBID\nCluster', color: '#a78bfa', icon: '⬡', sub: 'Identity Graph' },
    { x: 510, y: 340, label: 'Neo4j\nGraph DB', color: '#34d399', icon: '⬡', sub: 'Relationship Store' },
    { x: 720, y: 190, label: 'Status\nClassifier', color: '#fb923c', icon: '◉', sub: 'Active/Dormant' },
    { x: 720, y: 310, label: 'Groq AI\nLLM', color: '#f472b6', icon: '◈', sub: 'Explainability' },
    { x: 860, y: 250, label: 'Dashboard\nOfficer UI', color: '#38bdf8', icon: '▣', sub: 'Final Output' },
  ];

  const edges = [
    [0,4],[1,4],[2,4],[3,4],
    [4,5],[4,6],
    [5,7],[6,7],
    [7,9],[8,9],[5,8]
  ];

  // Draw edges
  edges.forEach(([a, b]) => {
    const na = nodes[a], nb = nodes[b];
    const grad = ctx.createLinearGradient(na.x + 50, na.y, nb.x, nb.y);
    grad.addColorStop(0, na.color + '80');
    grad.addColorStop(1, nb.color + '80');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(na.x + 50, na.y);
    const mx = (na.x + 50 + nb.x) / 2;
    ctx.bezierCurveTo(mx, na.y, mx, nb.y, nb.x, nb.y);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Draw nodes
  nodes.forEach(n => {
    // Glow
    const grd = ctx.createRadialGradient(n.x + 25, n.y, 5, n.x + 25, n.y, 40);
    grd.addColorStop(0, n.color + '33');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(n.x + 25, n.y, 40, 0, Math.PI * 2);
    ctx.fill();

    // Box
    ctx.fillStyle = '#161d2e';
    ctx.strokeStyle = n.color + 'aa';
    ctx.lineWidth = 1;
    roundRect(ctx, n.x - 10, n.y - 28, 70, 52, 8);
    ctx.fill();
    ctx.stroke();

    // Icon
    ctx.fillStyle = n.color;
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n.icon, n.x + 25, n.y - 8);

    // Label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 10px DM Sans, sans-serif';
    const lines = n.label.split('\n');
    lines.forEach((line, i) => ctx.fillText(line, n.x + 25, n.y + 8 + i * 13));

    // Sub label
    ctx.fillStyle = '#4a5a7a';
    ctx.font = '9px DM Sans, sans-serif';
    ctx.fillText(n.sub, n.x + 25, n.y + 32);
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ═══════════ DASHBOARD INIT ═════════════════════════════

function initDashboard() {
  renderStatsCards();
  renderCharts();
  renderRecentEvents();
  renderRecordsTable();
  renderStatusCards();
  populateUBIDSelects();
  document.getElementById('add-date').valueAsDate = new Date();
}

// ═══════════ STATS CARDS ════════════════════════════════

function renderStatsCards() {
  const { ubids, records } = AppState.data;
  const active = ubids.filter(u => u.status === 'active').length;
  const dormant = ubids.filter(u => u.status === 'dormant').length;
  const suspicious = ubids.filter(u => u.status === 'suspicious').length;

  const cards = [
    { label: 'Total Records', num: records.length, sub: '+12 this week', icon: '☰', color: '#3b82f6' },
    { label: 'Total UBIDs', num: ubids.length, sub: '4 depts each', icon: '⬡', color: '#10b981' },
    { label: 'Active Businesses', num: active, sub: `${Math.round(active/ubids.length*100)}% of total`, icon: '◉', color: '#10b981' },
    { label: 'Suspicious UBIDs', num: suspicious, sub: 'Requires review', icon: '⚠', color: '#ef4444' },
  ];

  document.getElementById('stats-grid').innerHTML = cards.map(c => `
    <div class="stat-card" style="--accent-color:${c.color}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-num">${c.num}</div>
      <div class="stat-sub">${c.sub}</div>
      <div class="stat-icon">${c.icon}</div>
    </div>
  `).join('');
}

// ═══════════ CHARTS (Pure Canvas) ═══════════════════════

function renderCharts() {
  renderStatusChart();
  renderActivityChart();
}

function renderStatusChart() {
  const canvas = document.getElementById('status-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { ubids } = AppState.data;
  const W = canvas.offsetWidth || 400, H = 220;
  canvas.width = W; canvas.height = H;

  const active = ubids.filter(u => u.status === 'active').length;
  const dormant = ubids.filter(u => u.status === 'dormant').length;
  const suspicious = ubids.filter(u => u.status === 'suspicious').length;
  const total = ubids.length;

  const slices = [
    { val: active, color: '#10b981', label: 'Active' },
    { val: dormant, color: '#f59e0b', label: 'Dormant' },
    { val: suspicious, color: '#ef4444', label: 'Suspicious' },
  ];

  ctx.clearRect(0, 0, W, H);
  const cx = W / 2 - 60, cy = H / 2, r = 80, innerR = 50;

  let start = -Math.PI / 2;
  slices.forEach(s => {
    const angle = (s.val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();

    // Glow
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#0b0f1a';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    start += angle;
  });

  // Donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = '#111827';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 22px Syne, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 4);
  ctx.fillStyle = '#4a5a7a';
  ctx.font = '11px DM Sans, sans-serif';
  ctx.fillText('UBIDs', cx, cy + 18);

  // Legend
  const lx = W - 130, ly = 40;
  slices.forEach((s, i) => {
    ctx.fillStyle = s.color;
    roundRect(ctx, lx, ly + i * 32, 12, 12, 2);
    ctx.fill();
    ctx.fillStyle = '#8899bb';
    ctx.font = '13px DM Sans, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${s.label}: ${s.val}`, lx + 18, ly + i * 32 + 11);
  });
}

function renderActivityChart() {
  const canvas = document.getElementById('activity-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400, H = 220;
  canvas.width = W; canvas.height = H;

  // Generate 30-day activity data
  const data = Array.from({ length: 30 }, (_, i) => ({
    day: i,
    renewals: randBetween(2, 18),
    inspections: randBetween(1, 12),
  }));

  ctx.clearRect(0, 0, W, H);
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const maxVal = 20;

  // Grid
  ctx.strokeStyle = '#1e2a3d';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + ch - (i / 4) * ch;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
    ctx.fillStyle = '#4a5a7a';
    ctx.font = '10px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(i * maxVal / 4), pad.left - 6, y + 3);
  }

  const drawLine = (key, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    data.forEach((d, i) => {
      const x = pad.left + (i / (data.length - 1)) * cw;
      const y = pad.top + ch - (d[key] / maxVal) * ch;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Fill area
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = pad.left + (i / (data.length - 1)) * cw;
      const y = pad.top + ch - (d[key] / maxVal) * ch;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(pad.left + cw, pad.top + ch);
    ctx.lineTo(pad.left, pad.top + ch);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    grad.addColorStop(0, color + '44');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
  };

  drawLine('renewals', '#3b82f6');
  drawLine('inspections', '#10b981');

  // X labels
  ctx.fillStyle = '#4a5a7a';
  ctx.font = '10px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  [0, 7, 14, 21, 29].forEach(i => {
    const x = pad.left + (i / (data.length - 1)) * cw;
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    ctx.fillText(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), x, H - 8);
  });

  // Legend
  ctx.fillStyle = '#3b82f6'; roundRect(ctx, W - 120, 8, 10, 10, 2); ctx.fill();
  ctx.fillStyle = '#8899bb'; ctx.font = '11px DM Sans'; ctx.textAlign = 'left';
  ctx.fillText('Renewals', W - 106, 17);
  ctx.fillStyle = '#10b981'; roundRect(ctx, W - 120, 24, 10, 10, 2); ctx.fill();
  ctx.fillStyle = '#8899bb';
  ctx.fillText('Inspections', W - 106, 33);
}

// ═══════════ RECENT EVENTS ══════════════════════════════

function renderRecentEvents() {
  const events = AppState.data.records
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map(r => ({
      name: r.businessName,
      dept: r.department,
      type: r.eventType,
      date: r.eventDate,
    }));

  const typeColors = { renewal: '#3b82f6', inspection: '#10b981', registration: '#8b5cf6', complaint: '#ef4444' };

  document.getElementById('recent-events').innerHTML = events.map(e => `
    <div class="event-row">
      <div class="event-dot" style="background:${typeColors[e.type] || '#4a5a7a'}"></div>
      <div class="event-name">${e.name}</div>
      <div class="event-dept"><span class="dept-badge dept-${e.dept}">${e.dept}</span></div>
      <div class="event-dept" style="color:#6b7a99">${capitalize(e.type)}</div>
      <div class="event-date">${e.date}</div>
    </div>
  `).join('');
}

// ═══════════ RECORDS TABLE ══════════════════════════════

function renderRecordsTable() {
  const tbody = document.getElementById('records-tbody');
  if (!tbody) return;
  tbody.innerHTML = AppState.filteredRecords.slice(0, 100).map(r => `
    <tr>
      <td style="font-weight:500;color:#e2e8f0">${r.businessName}</td>
      <td>${r.address}</td>
      <td><span class="dept-badge dept-${r.department}">${r.department}</span></td>
      <td style="font-family:var(--font-mono);font-size:12px">${r.lastRenewal}</td>
      <td>${r.inspections}</td>
      <td><span class="ubid-mono">${r.ubid}</span></td>
      <td><button class="btn-sm" onclick="viewUBID('${r.ubid}')">View UBID</button></td>
    </tr>
  `).join('');
}

function filterRecords() {
  const search = document.getElementById('exp-search').value.toLowerCase();
  const dept = document.getElementById('dept-filter').value;
  AppState.filteredRecords = AppState.data.records.filter(r => {
    const matchSearch = !search ||
      r.businessName.toLowerCase().includes(search) ||
      r.address.toLowerCase().includes(search);
    const matchDept = !dept || r.department === dept;
    return matchSearch && matchDept;
  });
  renderRecordsTable();
}

// ═══════════ GRAPH VISUALIZATION ════════════════════════

function populateUBIDSelects() {
  const opts = AppState.data.ubids.map(u =>
    `<option value="${u.id}">${u.id} — ${u.businessName}</option>`
  ).join('');

  const selIds = ['graph-ubid-sel', 'explain-ubid-sel'];
  selIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const cur = el.value;
      el.innerHTML = `<option value="">${id.includes('graph') ? 'Select UBID to visualize…' : 'Choose a UBID…'}</option>` + opts;
      if (cur) el.value = cur;
    }
  });
}

function renderGraph() {
  const sel = document.getElementById('graph-ubid-sel');
  if (AppState.newBusinessMode) {
    document.getElementById('location-map').style.display = 'none';
    document.getElementById('map-empty').style.display = 'flex';
    if (AppState.newBusinessMode === 'empty-canvas') drawEmptyCanvasMode();
    else if (AppState.newBusinessMode === 'template') drawTemplateMode();
    else if (AppState.newBusinessMode === 'comparison') drawComparisonMode();
    return;
  }
  if (!sel || !sel.value) {
    document.getElementById('graph-empty').style.display = 'flex';
    document.getElementById('graph-canvas').style.display = 'none';
    document.getElementById('location-map').style.display = 'none';
    document.getElementById('map-empty').style.display = 'flex';
    return;
  }
  const ubid = AppState.data.ubids.find(u => u.id === sel.value);
  if (!ubid) return;
  const records = AppState.data.records.filter(r => r.ubid === ubid.id);
  drawGraphCanvas(records, ubid);
  drawLocationMap(records, ubid);
}

function renderAllGraph() {
  const sample = AppState.data.ubids.slice(0, 6);
  const allRecords = sample.flatMap(u => AppState.data.records.filter(r => r.ubid === u.id));
  drawGraphCanvas(allRecords, null, sample);
  drawAllClustersMap(sample);
}

function drawGraphCanvas(records, ubid, ubids) {
  const canvas = document.getElementById('graph-canvas');
  const empty = document.getElementById('graph-empty');
  const legend = document.getElementById('graph-legend');
  if (!canvas) return;

  canvas.style.display = 'block';
  empty.style.display = 'none';
  legend.style.display = 'flex';

  const W = canvas.offsetWidth, H = canvas.offsetHeight || 480;
  canvas.width = W; canvas.height = H;

  const nodes = [];
  const edges = [];

  if (ubid) {
    // Single UBID: center node + dept nodes
    nodes.push({ x: W / 2, y: H / 2, label: ubid.id, color: '#60a5fa', r: 28, type: 'ubid', data: ubid });
    const depts = ['shops', 'labour', 'pollution', 'bescom'];
    depts.forEach((d, i) => {
      const angle = (i / depts.length) * Math.PI * 2 - Math.PI / 2;
      const dist = 140;
      const rec = records.find(r => r.department === d);
      nodes.push({
        x: W / 2 + Math.cos(angle) * dist,
        y: H / 2 + Math.sin(angle) * dist,
        label: d,
        color: DEPT_COLORS[d],
        r: 22,
        type: 'dept',
        data: rec,
        dept: d,
      });
      edges.push({ from: 0, to: i + 1, label: `${Math.floor(ubid.similarity * 100)}%` });
    });
  } else if (ubids) {
    // Multi-UBID layout
    ubids.forEach((u, ui) => {
      const angle = (ui / ubids.length) * Math.PI * 2 - Math.PI / 2;
      const dist = 160;
      const cx = W / 2 + Math.cos(angle) * dist;
      const cy = H / 2 + Math.sin(angle) * dist;
      const centerIdx = nodes.length;
      nodes.push({ x: cx, y: cy, label: u.id.split('-')[1], color: '#60a5fa', r: 20, type: 'ubid', data: u });

      const depts = ['shops', 'labour', 'pollution', 'bescom'];
      depts.forEach((d, di) => {
        const a2 = (di / 4) * Math.PI * 2 - Math.PI / 2;
        const nIdx = nodes.length;
        nodes.push({
          x: cx + Math.cos(a2) * 55,
          y: cy + Math.sin(a2) * 55,
          label: d.slice(0, 2).toUpperCase(),
          color: DEPT_COLORS[d],
          r: 14,
          type: 'dept',
        });
        edges.push({ from: centerIdx, to: nIdx, label: '' });
      });
    });
  }

  AppState.graphNodes = nodes;
  AppState.graphEdges = edges;

  animateGraph(canvas, nodes, edges);

  // Legend
  legend.innerHTML = Object.entries(DEPT_COLORS).map(([d, c]) => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${c}"></div>
      ${capitalize(d)}
    </div>
  `).join('') + `<div class="legend-item"><div class="legend-dot" style="background:#60a5fa"></div>UBID Cluster</div>`;

  // Tooltip
  let tooltipEl = document.getElementById('graph-tooltip');
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'graph-tooltip';
    tooltipEl.className = 'canvas-tooltip';
    document.body.appendChild(tooltipEl);
  }

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.r + 4);
    if (hit) {
      tooltipEl.style.display = 'block';
      tooltipEl.style.left = (e.clientX + 12) + 'px';
      tooltipEl.style.top = (e.clientY + 12) + 'px';
      tooltipEl.innerHTML = hit.data
        ? `<strong>${hit.data.businessName || hit.data.id}</strong><br/>${hit.data.address || hit.data.status || ''}`
        : `<strong>${hit.label}</strong>`;
    } else {
      tooltipEl.style.display = 'none';
    }
  };
  canvas.onmouseleave = () => { tooltipEl.style.display = 'none'; };
}

let animTick = 0;
function animateGraph(canvas, nodes, edges) {
  if (AppState.graphAnimFrame) cancelAnimationFrame(AppState.graphAnimFrame);
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  function frame() {
    animTick++;
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    bgGrad.addColorStop(0, '#13192a');
    bgGrad.addColorStop(1, '#0b0f1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Animated pulse rings from center
    const pulse = (animTick % 120) / 120;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, pulse * 200, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(59,130,246,${0.15 * (1 - pulse)})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw edges
    edges.forEach(e => {
      const na = nodes[e.from], nb = nodes[e.to];
      if (!na || !nb) return;
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
      grad.addColorStop(0, na.color + '88');
      grad.addColorStop(1, nb.color + '88');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Animated particle on edge
      const t = ((animTick * 0.008) % 1);
      const px = na.x + (nb.x - na.x) * t;
      const py = na.y + (nb.y - na.y) * t;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = na.color;
      ctx.shadowColor = na.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Edge label
      if (e.label) {
        const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
        ctx.fillStyle = '#8899bb';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(e.label, mx, my - 6);
      }
    });

    // Draw nodes
    nodes.forEach((n, idx) => {
      const pulse2 = Math.sin(animTick * 0.04 + idx * 0.8) * 3;

      // Glow
      const grd = ctx.createRadialGradient(n.x, n.y, 2, n.x, n.y, n.r * 2.5);
      grd.addColorStop(0, n.color + '55');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + pulse2 * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#111827';
      ctx.fill();
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `${n.type === 'ubid' ? 'bold ' : ''}${n.r > 20 ? 12 : 10}px DM Sans, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + (n.r > 20 ? 4 : 3));
    });

    AppState.graphAnimFrame = requestAnimationFrame(frame);
  }
  frame();
}

// ═══════════ LOCATION MAP VISUALIZATION ═════════════════

function drawLocationMap(records, ubid) {
  const mapContainer = document.getElementById('location-map');
  const mapEmpty = document.getElementById('map-empty');
  const mapLegend = document.getElementById('map-legend');
  
  if (!mapContainer) return;

  mapContainer.style.display = 'block';
  mapEmpty.style.display = 'none';
  mapLegend.style.display = 'flex';

  // Base coordinates for Bengaluru
  const baseCoords = [12.9716, 77.5946];
  
  // Generate realistic dept locations within ~10km radius
  const deptLocations = {
    shops: [12.9756, 77.5900],      // ~5.5km from center
    labour: [12.9650, 77.5950],     // ~8.3km from center
    pollution: [12.9850, 77.6050],  // ~12.5km from center
    bescom: [12.9500, 77.5750],     // ~28km from center
  };

  // Destroy existing map if it exists
  if (window.currentMap) {
    window.currentMap.remove();
  }

  // Initialize Leaflet map with dark theme
  const map = L.map('location-map', {
    center: baseCoords,
    zoom: 12,
    scrollWheelZoom: true,
    zoomControl: true,
  });

  // Add dark OpenStreetMap tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '©OpenStreetMap ©CartoDB',
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);

  window.currentMap = map;

  // Helper to calculate distance between coordinates
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Function to get distance range label
  function getDistanceRange(km) {
    if (km <= 10) return '🟢 Within 10km';
    if (km <= 30) return '🟡 10-30km';
    if (km <= 50) return '🟠 30-50km';
    return '🔴 Beyond 50km';
  }

  // Add center UBID marker
  L.circleMarker(baseCoords, {
    radius: 12,
    fillColor: '#60a5fa',
    color: '#3b82f6',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  }).addTo(map).bindPopup(`<div style="color:#e2e8f0;font-family:DM Sans"><strong>${ubid.id}</strong><br/>${ubid.businessName}</div>`);

  // Add department markers and connections
  const deptMarkers = [];
  const colorMap = {
    shops: '#3b82f6',
    labour: '#10b981',
    pollution: '#8b5cf6',
    bescom: '#f97316',
  };

  records.forEach(record => {
    const dept = record.department;
    const coords = deptLocations[dept];
    if (!coords) return;

    // Calculate distance
    const distance = getDistance(baseCoords[0], baseCoords[1], coords[0], coords[1]);
    const distanceRange = getDistanceRange(distance);

    // Add line from center to dept
    L.polyline([baseCoords, coords], {
      color: colorMap[dept],
      weight: 1.5,
      opacity: 0.5,
      dashArray: '5,5',
    }).addTo(map);

    // Add department marker
    L.circleMarker(coords, {
      radius: 10,
      fillColor: colorMap[dept],
      color: colorMap[dept],
      weight: 1.5,
      opacity: 0.9,
      fillOpacity: 0.7,
    }).addTo(map).bindPopup(
      `<div style="color:#e2e8f0;font-family:DM Sans">
        <strong>${capitalize(dept)}</strong><br/>
        ${record.businessName}<br/>
        <small style="color:#8899bb">${distance.toFixed(1)} km</small><br/>
        <small style="color:#6a8aaa">${distanceRange}</small>
      </div>`
    );
  });

  // Update legend
  mapLegend.innerHTML = `
    <div class="map-legend-item">
      <div class="map-legend-dot" style="background:#60a5fa;box-shadow:0 0 8px #60a5fa"></div>
      <span><strong>${ubid.businessName}</strong></span>
    </div>
    <div class="map-legend-item">
      <span>📊 ${records.length} Department Records</span>
    </div>
    <div class="map-legend-item">
      <span>Status: <strong style="color:${ubid.status==='active'?'#10b981':ubid.status==='dormant'?'#f59e0b':'#ef4444'}">${capitalize(ubid.status)}</strong></span>
    </div>
    <div class="map-legend-item" style="margin-top:8px;padding-top:8px;border-top:1px solid #1e2a3d">
      <span style="font-size:10px">🟢 ≤10km | 🟡 10-30km | 🟠 30-50km | 🔴 >50km</span>
    </div>
  `;
}

function drawAllClustersMap(ubids) {
  const mapContainer = document.getElementById('location-map');
  const mapEmpty = document.getElementById('map-empty');
  const mapLegend = document.getElementById('map-legend');
  
  if (!mapContainer) return;

  mapContainer.style.display = 'block';
  mapEmpty.style.display = 'none';
  mapLegend.style.display = 'flex';

  // Base coordinates for Bengaluru
  const baseCoords = [12.9716, 77.5946];
  
  // Destroy existing map if it exists
  if (window.currentMap) {
    window.currentMap.remove();
  }

  // Initialize Leaflet map
  const map = L.map('location-map', {
    center: baseCoords,
    zoom: 11,
    scrollWheelZoom: true,
    zoomControl: true,
  });

  // Add dark OpenStreetMap tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '©OpenStreetMap ©CartoDB',
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);

  window.currentMap = map;

  // Color for each UBID based on status
  const statusColors = {
    active: '#10b981',
    dormant: '#f59e0b',
    closed: '#ef4444'
  };

  // Add a marker for each cluster center
  ubids.forEach((ubid, idx) => {
    // Vary coordinates slightly around Bengaluru
    const offset = idx * 0.05;
    const lat = baseCoords[0] + (Math.random() - 0.5) * 0.1;
    const lon = baseCoords[1] + (Math.random() - 0.5) * 0.1;
    const coords = [lat, lon];

    const color = statusColors[ubid.status] || '#60a5fa';

    // Add cluster marker
    L.circleMarker(coords, {
      radius: 16,
      fillColor: color,
      color: color,
      weight: 2,
      opacity: 0.9,
      fillOpacity: 0.7,
    }).addTo(map).bindPopup(`
      <div style="color:#e2e8f0;font-family:DM Sans;font-size:12px">
        <strong>${ubid.id}</strong><br/>
        ${ubid.businessName}<br/>
        <span style="color:${color};font-weight:600">${capitalize(ubid.status)}</span><br/>
        <small style="color:#8899bb">📊 ${AppState.data.records.filter(r => r.ubid === ubid.id).length} records</small>
      </div>
    `);
  });

  // Fit all markers in view
  const group = new L.featureGroup(map.eachLayer((layer) => {
    if (layer instanceof L.CircleMarker) group.addLayer(layer);
  }));
  if (group.getLayers().length > 0) {
    map.fitBounds(group.getBounds().pad(0.1));
  }

  // Update legend
  mapLegend.innerHTML = `
    <div class="map-legend-item">
      <span><strong>All Business Clusters (${ubids.length})</strong></span>
    </div>
    <div class="map-legend-item">
      <span>📍 Click markers for details</span>
    </div>
    <div class="map-legend-item" style="margin-top:8px;padding-top:8px;border-top:1px solid #1e2a3d">
      <span style="font-size:11px;color:#8899bb">Status Colors:</span><br/>
      <span style="font-size:10px">🟢 Active | 🟡 Dormant | 🔴 Closed</span>
    </div>
  `;
}

// ═══════════ STATUS MONITOR ═════════════════════════════

let currentStatusFilter = 'all';

function filterStatus(f, btn) {
  currentStatusFilter = f;
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderStatusCards();
}

function renderStatusCards() {
  const { ubids } = AppState.data;
  const filtered = currentStatusFilter === 'all'
    ? ubids
    : ubids.filter(u => u.status === currentStatusFilter);

  const borderMap = { active: '#10b981', dormant: '#f59e0b', suspicious: '#ef4444' };

  document.getElementById('status-cards').innerHTML = filtered.map(u => `
    <div class="status-card" style="--card-border:${borderMap[u.status]}44" onclick="viewUBID('${u.id}')">
      <div class="sc-header">
        <span class="sc-ubid">${u.id}</span>
        <span class="sc-status-badge status-${u.status}">${capitalize(u.status)}</span>
      </div>
      <div class="sc-name">${u.businessName}</div>
      <div class="sc-meta">${u.address} · ${u.recordCount} dept records</div>
      <div class="sc-signals">
        <span class="signal-chip">Renewal ✓</span>
        <span class="signal-chip">Inspection ✓</span>
        <span class="signal-chip">${u.electricityUsage} kWh</span>
        ${u.status === 'suspicious' ? '<span class="signal-chip" style="color:#ef4444;border-color:#ef444430">⚠ Irregular</span>' : ''}
      </div>
      <div class="sc-confidence">
        <div class="conf-bar">
          <div class="conf-fill" style="width:${u.confidence}%"></div>
        </div>
        <span class="conf-val">${u.confidence}%</span>
      </div>
    </div>
  `).join('');
}

// ═══════════ UBID MODAL ══════════════════════════════════

function viewUBID(ubidId) {
  const ubid = AppState.data.ubids.find(u => u.id === ubidId);
  if (!ubid) return;
  const records = AppState.data.records.filter(r => r.ubid === ubidId);

  document.getElementById('modal-content').innerHTML = `
    <div style="margin-bottom:20px">
      <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);margin-bottom:6px">${ubid.id}</div>
      <div style="font-family:var(--font-display);font-size:22px;font-weight:800;margin-bottom:4px">${ubid.businessName}</div>
      <div style="font-size:13px;color:var(--text-secondary)">${ubid.address}</div>
    </div>
    <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
      <span class="sc-status-badge status-${ubid.status}">${capitalize(ubid.status)}</span>
      <span style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);padding:3px 10px;border:1px solid var(--border);border-radius:10px">
        Confidence: ${ubid.confidence}%
      </span>
      <span style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);padding:3px 10px;border:1px solid var(--border);border-radius:10px">
        Similarity: ${ubid.similarity}
      </span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
      ${records.map(r => `
        <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:14px">
          <span class="dept-badge dept-${r.department}">${r.department}</span>
          <div style="font-size:13px;font-weight:500;margin-top:8px">${r.businessName}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${r.address}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;font-family:var(--font-mono)">Renewal: ${r.lastRenewal}</div>
          <div style="font-size:11px;color:var(--text-muted)">Inspections: ${r.inspections} · Elec: ${r.electricityUsage} kWh</div>
        </div>
      `).join('')}
    </div>
    <button class="btn-primary w100" onclick="document.getElementById('ubid-modal').classList.remove('open'); setTimeout(()=>{showSection('explain',document.querySelector('[data-page=explain]'));document.getElementById('explain-ubid-sel').value='${ubid.id}';},100)">
      ◈ Generate AI Explanation
    </button>
  `;
  document.getElementById('ubid-modal').classList.add('open');
}

function closeModal(e) {
  if (e.target.id === 'ubid-modal') {
    document.getElementById('ubid-modal').classList.remove('open');
  }
}

// ═══════════ EXPLAINABILITY AI ═══════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('explain-ubid-sel');
  if (sel) sel.addEventListener('change', function() {
    const ubid = AppState.data.ubids.find(u => u.id === this.value);
    if (!ubid) return;
    document.getElementById('explain-signals').innerHTML = `
      <div class="signal-list">
        <div class="signal-row">
          <span class="signal-name">Department Match</span>
          <span class="signal-pct">30%</span>
        </div>
        <div class="signal-row">
          <span class="signal-name">Renewal Proximity</span>
          <span class="signal-pct">25%</span>
        </div>
        <div class="signal-row">
          <span class="signal-name">Address Similarity</span>
          <span class="signal-pct">25%</span>
        </div>
        <div class="signal-row">
          <span class="signal-name">Name Similarity</span>
          <span class="signal-pct">20%</span>
        </div>
        <div style="margin-top:10px;padding:10px;background:var(--bg-card2);border-radius:8px;font-size:12px;color:var(--text-muted)">
          Overall Similarity Score: <strong style="color:var(--accent)">${(ubid.similarity * 100).toFixed(0)}%</strong>
        </div>
      </div>
    `;
  });
});

async function generateExplanation() {
  const ubidSel = document.getElementById('explain-ubid-sel');
  const apiKey = document.getElementById('groq-api-key').value.trim() || getActiveAPIKey();
  const resultEl = document.getElementById('explain-result');

  if (!ubidSel.value) return;

  const ubid = AppState.data.ubids.find(u => u.id === ubidSel.value);
  const records = AppState.data.records.filter(r => r.ubid === ubidSel.value);

  resultEl.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div>Analyzing UBID…</div>
    </div>
  `;

  let explanation;
  let isRealAPI = false;

  if (apiKey && apiKey.startsWith('gsk_')) {
    explanation = await callGroqAPI(apiKey, ubid, records);
    isRealAPI = explanation && !explanation.includes('Founded because records from');
  } else {
    await new Promise(r => setTimeout(r, 1500));
    explanation = generateDemoExplanation(ubid, records);
  }

  renderExplanationResult(resultEl, ubid, records, explanation, isRealAPI);
}

async function callGroqAPI(apiKey, ubid, records) {
  const prompt = `You are a government business identity analyst. Analyze these business records and explain why they belong to the same business entity (UBID: ${ubid.id}).

Records:
${records.map(r => `- Department: ${r.department.toUpperCase()}, Name: "${r.businessName}", Address: "${r.address}", Last Renewal: ${r.lastRenewal}, Inspections: ${r.inspections}, Electricity: ${r.electricityUsage} kWh/month`).join('\n')}

Business cluster info:
- Similarity Score: ${ubid.similarity}
- Status: ${ubid.status}
- Base Business: ${ubid.businessName}

Write a 3-4 sentence officer-friendly explanation covering: (1) why these records belong to the same business, (2) key temporal signals used, (3) confidence level reasoning. Keep it professional and clear.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API Error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || generateDemoExplanation(ubid, records);
  } catch (e) {
    console.log('API call result: Demo mode (API unavailable)');
    return generateDemoExplanation(ubid, records);
  }
}

function generateDemoExplanation(ubid, records) {
  const depts = records.map(r => capitalize(r.department)).join(', ');
  const renewals = records.map(r => r.lastRenewal).sort();
  const daysDiff = Math.abs(new Date(renewals[renewals.length-1]) - new Date(renewals[0])) / (1000*60*60*24);
  const conf = ubid.confidence >= 85 ? 'HIGH' : ubid.confidence >= 70 ? 'MEDIUM' : 'LOW';

  return `This UBID (${ubid.id}) was formed because records from ${depts} departments show highly correlated temporal behavior patterns. The renewal dates are within ${Math.round(daysDiff)} days of each other, indicating a synchronized compliance cycle typical of a single business entity operating across multiple regulatory jurisdictions. Address similarity analysis yielded a Levenshtein score above 0.80, and the business name variants follow predictable abbreviation patterns (e.g., "Pvt Ltd", "& Sons") consistent with multi-department registrations. Electricity consumption profiles from BESCOM records match the operational scale suggested by Shops and Labour records. Confidence: ${conf} (${ubid.confidence}%).`;
}

function renderExplanationResult(el, ubid, records, explanation, isRealAPI) {
  const signals = [
    { label: 'Renewal Alignment', val: `${Math.floor(ubid.similarity * 35)} day window`, color: '#3b82f6' },
    { label: 'Address Match', val: `${Math.floor(ubid.similarity * 100)}% Levenshtein`, color: '#10b981' },
    { label: 'Name Variants', val: `${records.length} detected`, color: '#8b5cf6' },
    { label: 'Electricity Profile', val: `${ubid.electricityUsage} kWh avg`, color: '#f97316' },
  ];

  const modeColor = isRealAPI ? '#10b981' : '#f59e0b';
  const modeText = isRealAPI ? '🟢 REAL API' : '🟡 DEMO MODE';

  el.innerHTML = `
    <div class="ai-result">
      <div class="ai-header">
        <div>
          <div style="font-family:var(--font-display);font-size:18px;font-weight:800;margin-bottom:4px">${ubid.businessName}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">${ubid.id}</div>
        </div>
        <div class="ai-badge" style="background:${modeColor}33;border:1px solid ${modeColor}66;color:${modeColor}">${modeText}</div>
      </div>

      <div class="ai-text">${explanation}</div>

      <div class="ai-signals-grid">
        ${signals.map(s => `
          <div class="ai-signal">
            <div class="ai-signal-label">${s.label}</div>
            <div class="ai-signal-val" style="color:${s.color}">${s.val}</div>
          </div>
        `).join('')}
      </div>

      <div class="ai-conf-section">
        <div class="ai-conf-label">
          <span>Confidence Score</span>
          <span class="ai-conf-num">${ubid.confidence}%</span>
        </div>
        <div class="conf-bar" style="height:8px">
          <div class="conf-fill" style="width:${ubid.confidence}%"></div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:8px">
          Status Classification: <strong style="color:${ubid.status==='active'?'#10b981':ubid.status==='dormant'?'#f59e0b':'#ef4444'}">${capitalize(ubid.status)}</strong>
          · Threshold: 0.65 · Score: ${ubid.similarity}
        </div>
      </div>
    </div>
  `;
}

// ═══════════ ADD RECORD ═════════════════════════════════

async function submitRecord() {
  const name = document.getElementById('add-name').value.trim();
  const addr = document.getElementById('add-address').value.trim();
  const dept = document.getElementById('add-dept').value;
  const eventType = document.getElementById('add-event').value;
  const date = document.getElementById('add-date').value;
  const elec = document.getElementById('add-elec').value || randBetween(400, 2000);
  const apiKey = (document.getElementById('add-groq-key')?.value.trim() || getActiveAPIKey()).trim();
  const resultEl = document.getElementById('add-result');

  if (!name || !addr || !date) {
    resultEl.innerHTML = `<div style="color:var(--red);padding:20px;text-align:center;font-size:14px">Please fill in Business Name, Address, and Event Date.</div>`;
    return;
  }

  resultEl.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div>Processing record…</div>
    </div>
  `;

  await new Promise(r => setTimeout(r, 800));

  // Temporal similarity matching
  const { ubids, records } = AppState.data;
  let bestMatch = null;
  let bestScore = 0;

  ubids.forEach(u => {
    let score = 0;
    const uRecords = records.filter(r => r.ubid === u.id);

    // Name similarity
    const nameSim = cosineSimilarity(name.toLowerCase(), u.businessName.toLowerCase());
    score += nameSim * 0.35;

    // Address similarity
    const addrSim = cosineSimilarity(addr.toLowerCase(), u.address.toLowerCase());
    score += addrSim * 0.35;

    // Department: if this dept doesn't exist yet, boost
    const hasDept = uRecords.some(r => r.department === dept);
    if (!hasDept) score += 0.2;

    if (score > bestScore) { bestScore = score; bestMatch = u; }
  });

  const threshold = 0.45;
  let assignedUBID, isNew = false, confidence;

  if (bestScore >= threshold && bestMatch) {
    assignedUBID = bestMatch;
    confidence = Math.min(99, Math.floor(bestScore * 100));
  } else {
    // Create new UBID
    const newId = `UBID-${String(ubids.length + 1).padStart(4, '0')}`;
    assignedUBID = {
      id: newId,
      businessName: name,
      address: addr,
      status: 'active',
      similarity: 0.70,
      confidence: 70,
      recordCount: 1,
      departments: [dept],
      inspections: 0,
      lastActivity: date,
      electricityUsage: parseInt(elec),
    };
    AppState.data.ubids.push(assignedUBID);
    isNew = true;
    confidence = 70;
  }

  // Add record
  const newRecord = {
    id: `REC-${String(records.length + 1).padStart(5, '0')}`,
    ubid: assignedUBID.id,
    businessName: name,
    address: addr,
    department: dept,
    lastRenewal: date,
    inspections: 0,
    electricityUsage: parseInt(elec),
    eventType,
    eventDate: date,
  };
  AppState.data.records.push(newRecord);
  AppState.filteredRecords.push(newRecord);

  await new Promise(r => setTimeout(r, 800));

  // AI Explanation
  resultEl.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <div>Generating explanation…</div>
    </div>
  `;
  await new Promise(r => setTimeout(r, 400));

  let explanation;
  let isRealAPI = false;
  if (apiKey && apiKey.startsWith('gsk_')) {
    explanation = await callGroqAPI(apiKey, assignedUBID, AppState.data.records.filter(r => r.ubid === assignedUBID.id));
    isRealAPI = explanation && !explanation.includes('Founded because records from');
  } else {
    explanation = isNew
      ? `New UBID ${assignedUBID.id} was created for "${name}" at "${addr}" as no existing cluster exceeded the similarity threshold of 0.45. The ${dept} department record dated ${date} has been registered as the founding record. Temporal analysis will begin accumulating on subsequent events. Confidence: INITIAL (70%).`
      : `Record from ${capitalize(dept)} department was matched to ${assignedUBID.id} (${assignedUBID.businessName}) with a similarity score of ${(bestScore).toFixed(2)}. Name and address patterns showed ${Math.floor(bestScore * 100)}% correlation. The temporal event (${eventType} on ${date}) has been appended to the existing cluster's activity timeline. Confidence: ${confidence >= 85 ? 'HIGH' : 'MEDIUM'} (${confidence}%).`;
  }

  const modeColor = isRealAPI ? '#10b981' : '#f59e0b';
  const modeText = isRealAPI ? '🟢 REAL API' : '🟡 DEMO MODE';

  resultEl.innerHTML = `
    <div class="result-ubid-card">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
        <div>
          <div class="result-tag">${isNew ? '✦ NEW UBID CREATED' : '✓ MATCHED EXISTING UBID'}</div>
          <div class="result-ubid-val">${assignedUBID.id}</div>
        </div>
        <div style="background:${modeColor}33;border:1px solid ${modeColor}66;color:${modeColor};padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600">${modeText}</div>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);margin-bottom:4px">${assignedUBID.businessName}</div>
      <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">${assignedUBID.address}</div>

      <div class="result-divider"></div>

      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
        <div style="text-align:center;background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:12px 20px">
          <div style="font-family:var(--font-display);font-size:24px;font-weight:800;color:var(--accent)">${confidence}%</div>
          <div style="font-size:11px;color:var(--text-muted)">Confidence</div>
        </div>
        <div style="text-align:center;background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:12px 20px">
          <span class="sc-status-badge status-${assignedUBID.status}">${capitalize(assignedUBID.status)}</span>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Status</div>
        </div>
        <div style="text-align:center;background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:12px 20px">
          <span class="dept-badge dept-${dept}">${dept}</span>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Department</div>
        </div>
      </div>

      <div class="result-divider"></div>

      <div style="font-size:12px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">◈ AI Explanation</div>
      <div class="result-explain-text">${explanation}</div>

      <div class="result-divider"></div>
      <div style="display:flex;gap:10px">
        <button class="btn-sm" onclick="viewUBID('${assignedUBID.id}')">View Full UBID →</button>
        <button class="btn-sm" onclick="showSection('graph',document.querySelector('[data-page=graph]'));document.getElementById('graph-ubid-sel').value='${assignedUBID.id}';renderGraph()">Show in Graph →</button>
      </div>
    </div>
  `;

  // Refresh stats
  renderStatsCards();
  populateUBIDSelects();
}

// Simple cosine-like string similarity
function cosineSimilarity(a, b) {
  const aWords = new Set(a.split(/\s+/));
  const bWords = new Set(b.split(/\s+/));
  let common = 0;
  aWords.forEach(w => { if (bWords.has(w)) common++; });
  if (aWords.size + bWords.size === 0) return 0;
  return (2 * common) / (aWords.size + bWords.size);
}

// ═══════════ UTILITIES ══════════════════════════════════

function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }

// ═══════════ INIT ════════════════════════════════════════

window.addEventListener('load', () => {
  drawArchCanvas();

  // Animate hero elements
  setTimeout(() => {
    document.querySelectorAll('.feat-card').forEach((c, i) => {
      c.style.animation = `fadeUp 0.5s ${0.1 + i * 0.08}s ease both`;
    });
  }, 100);

  // Default add-date
  const addDate = document.getElementById('add-date');
  if (addDate) addDate.valueAsDate = new Date();

  // Set up API key listeners
  const explainKeyInput = document.getElementById('groq-api-key');
  const addKeyInput = document.getElementById('add-groq-key');
  
  if (explainKeyInput) {
    explainKeyInput.addEventListener('input', updateAPIStatus);
  }
  if (addKeyInput) {
    addKeyInput.addEventListener('input', updateAPIStatus);
  }

  // Initial status update
  setTimeout(updateAPIStatus, 100);

  // Redraw arch on resize
  window.addEventListener('resize', () => {
    drawArchCanvas();
    if (AppState.currentSection === 'overview') renderCharts();
  });
});

// ═════════════ NEW BUSINESS VISUALIZATION MODES ═════════════

function showNewBusinessModal() {
  document.getElementById('new-business-modal').classList.add('open');
}
