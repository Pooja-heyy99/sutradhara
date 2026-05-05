// ═══════════ NEW BUSINESS VISUALIZATION MODES ═════════════

function drawEmptyCanvasMode() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  document.getElementById('graph-empty').style.display = 'none';
  document.getElementById('graph-legend').style.display = 'flex';
  const W = canvas.offsetWidth, H = canvas.offsetHeight || 480;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0a0e17');
  bgGrad.addColorStop(1, '#0f1828');
  function animate() {
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#1a2a4a';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    const pulseFactor = 0.8 + Math.sin(Date.now() / 500) * 0.2;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 32 * pulseFactor, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(96, 165, 250, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 24px DM Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+ UBID', W / 2, H / 2);
    ctx.fillStyle = '#8899bb';
    ctx.font = '14px DM Sans';
    ctx.fillText('Empty Canvas Mode', W / 2, 60);
    ctx.font = '12px DM Sans';
    ctx.fillStyle = '#6a8aaa';
    ctx.fillText('Start building a new business cluster', W / 2, 85);
    ctx.fillText('Add department connections as you build', W / 2, 110);
    AppState.graphAnimFrame = requestAnimationFrame(animate);
  }
  animate();
  document.getElementById('graph-legend').innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:12px"><span>🔷 Empty Canvas</span><span style="color:var(--text-muted)">|</span><span>Build from scratch · Link departments</span></div>`;
}

function drawTemplateMode() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  document.getElementById('graph-empty').style.display = 'none';
  document.getElementById('graph-legend').style.display = 'flex';
  const W = canvas.offsetWidth, H = canvas.offsetHeight || 480;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const template = {
    center: { x: W / 2, y: H / 2, r: 28 },
    depts: [
      { label: 'Shops', color: '#3b82f6', x: W / 2 - 120, y: H / 2 - 100, r: 20, conf: '85%' },
      { label: 'Labour', color: '#10b981', x: W / 2 + 120, y: H / 2 - 100, r: 20, conf: '78%' },
      { label: 'Pollution', color: '#8b5cf6', x: W / 2 + 120, y: H / 2 + 100, r: 20, conf: '72%' },
      { label: 'BESCOM', color: '#f97316', x: W / 2 - 120, y: H / 2 + 100, r: 20, conf: '65%' },
    ]
  };
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0a0e17');
  bgGrad.addColorStop(1, '#0f1828');
  function animate() {
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    const time = (Date.now() / 2000) % 1;
    template.depts.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(template.center.x, template.center.y);
      ctx.lineTo(d.x, d.y);
      ctx.strokeStyle = d.color + '66';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      const px = template.center.x + (d.x - template.center.x) * time;
      const py = template.center.y + (d.y - template.center.y) * time;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = d.color + '88';
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(template.center.x, template.center.y, template.center.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(96, 165, 250, 0.1)';
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 12px DM Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NEW\nUBID', template.center.x, template.center.y);
    template.depts.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 24, 40, 0.8)';
      ctx.fill();
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = d.color;
      ctx.font = 'bold 9px DM Sans';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.label.slice(0, 2), d.x, d.y - 4);
      ctx.font = '7px DM Sans';
      ctx.fillStyle = '#6a8aaa';
      ctx.fillText(d.conf, d.x, d.y + 8);
    });
    ctx.fillStyle = '#8899bb';
    ctx.font = 'bold 14px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText('🔶 Template Mode', W / 2, 40);
    ctx.font = '11px DM Sans';
    ctx.fillStyle = '#6a8aaa';
    ctx.fillText('Suggested linkages · Verify & approve', W / 2, 60);
    AppState.graphAnimFrame = requestAnimationFrame(animate);
  }
  animate();
  document.getElementById('graph-legend').innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:12px"><span>🔶 Template Mode</span><span style="color:var(--text-muted)">|</span><span>Auto-linked · Adjust confidence</span></div>`;
}

function drawComparisonMode() {
  const canvas = document.getElementById('graph-canvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  document.getElementById('graph-empty').style.display = 'none';
  document.getElementById('graph-legend').style.display = 'flex';
  const W = canvas.offsetWidth, H = canvas.offsetHeight || 480;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const similar = AppState.data.ubids.slice(0, 3);
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0a0e17');
  bgGrad.addColorStop(1, '#0f1828');
  function animate() {
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    const pulseNew = 1 + Math.sin(Date.now() / 400) * 0.1;
    ctx.beginPath();
    ctx.arc(W * 0.25, H / 2, 32 * pulseNew, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(96, 165, 250, 0.1)';
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 11px DM Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NEW\nUBID', W * 0.25, H / 2);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#4a6a8a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W * 0.35, H / 2);
    ctx.lineTo(W * 0.65, H / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    similar.forEach((ubid, i) => {
      const yOffset = (i - 1) * 110;
      const x = W * 0.8;
      const y = H / 2 + yOffset;
      const sim = ubid.similarity;
      const col = sim > 0.8 ? '#10b981' : sim > 0.6 ? '#f59e0b' : '#ef4444';
      const radius = 28 + (1 - sim) * 10;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = col + '15';
      ctx.fill();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.font = 'bold 9px DM Sans';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ubid.id.slice(-2), x, y - 5);
      ctx.font = '8px DM Sans';
      ctx.fillStyle = '#8899bb';
      ctx.fillText(`${(sim * 100).toFixed(0)}%`, x, y + 10);
    });
    ctx.fillStyle = '#8899bb';
    ctx.font = 'bold 14px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText('🔹 Comparison Mode', W / 2, 35);
    ctx.font = '11px DM Sans';
    ctx.fillStyle = '#6a8aaa';
    ctx.fillText('Compare & auto-link or create new', W / 2, 55);
    AppState.graphAnimFrame = requestAnimationFrame(animate);
  }
  animate();
  document.getElementById('graph-legend').innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:12px"><span>🔹 Comparison</span><span style="color:var(--text-muted)">|</span><span style="font-size:11px">🟢≥80% | 🟡60-80% | 🔴<60%</span></div>`;
}

function startNewBusinessMode(modeType) {
  AppState.newBusinessMode = modeType;
  document.getElementById('graph-ubid-sel').value = '';
  showSection('graph', document.querySelector('[data-page=graph]'));
  setTimeout(() => renderGraph(), 50);
}
