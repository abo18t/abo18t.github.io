/* FE Daily Report standalone script */
const $dailyTeam = document.getElementById('dailyTeam');
const $dailyDate = document.getElementById('dailyDate');
const $dailyProjectId = document.getElementById('dailyProjectId');
const $dailyProjectName = document.getElementById('dailyProjectName');
const $dailyDone = document.getElementById('dailyDone');
const $dailyInProgress = document.getElementById('dailyInProgress');
const $dailyRemaining = document.getElementById('dailyRemaining');
const $dailyNote = document.getElementById('dailyNote');
const $btnDailyCopyTop = document.getElementById('btnDailyCopyTop');
const $outputDaily = document.getElementById('outputDaily');
const $toast = document.getElementById('toast');
const $previewDaily = document.getElementById('previewDaily');
const STORAGE_KEYS = {
  team: 'daily.team',
  projectId: 'daily.projectId',
  projectName: 'daily.projectName',
  projectMap: 'daily.projectMap',
};

/** In-memory project map (projectId -> projectName) */
let projectIdToName = {};

function initializeDailyDefaults() {
  const today = new Date(); const yyyy = today.getFullYear(); const mm = String(today.getMonth() + 1).padStart(2, '0'); const dd = String(today.getDate()).padStart(2, '0');
  if ($dailyDate && !$dailyDate.value) $dailyDate.value = `${yyyy}-${mm}-${dd}`;
  // Load from localStorage
  try {
    // Load project map
    const rawMap = localStorage.getItem(STORAGE_KEYS.projectMap);
    if (rawMap) {
      try { projectIdToName = JSON.parse(rawMap) || {}; } catch (_) { projectIdToName = {}; }
    }
    const savedTeam = localStorage.getItem(STORAGE_KEYS.team);
    const savedPid = localStorage.getItem(STORAGE_KEYS.projectId);
    const savedPname = localStorage.getItem(STORAGE_KEYS.projectName);
    if ($dailyTeam) $dailyTeam.value = savedTeam || $dailyTeam.value || 'FE';
    if ($dailyProjectId) $dailyProjectId.value = savedPid || $dailyProjectId.value || '';
    if ($dailyProjectName) {
      // If we have a saved name, use it; otherwise try map by ID
      const mapped = getProjectNameById(($dailyProjectId && $dailyProjectId.value.trim()) || '');
      $dailyProjectName.value = savedPname || mapped || $dailyProjectName.value || '';
    }
  } catch (_) {
    if ($dailyTeam && !$dailyTeam.value) $dailyTeam.value = 'FE';
  }
}

function linesFromTextarea(el) {
  if (!el) return []; return (el.value || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

function formatDateDisplay(dateInputValue) {
  if (!dateInputValue) return ''; const d = new Date(dateInputValue);
  const dd = String(d.getDate()).padStart(2, '0'); const mm = String(d.getMonth() + 1).padStart(2, '0'); const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function buildDailyText(dateDisplay, done, prog, remain, note) {
  const teamName = ($dailyTeam && $dailyTeam.value.trim()) || 'FE';
  const projectId = ($dailyProjectId && $dailyProjectId.value.trim()) || '';
  const projectName = ($dailyProjectName && $dailyProjectName.value.trim()) || '';
  const header = `**==== ${teamName} DAILY REPORT ====**\n**===== (${dateDisplay}) =====**\n`;
  const projectLine = (projectId || projectName) ? `\n**PROJECT:** ${projectId}${projectId && projectName ? ' - ' : ''}${projectName}\n` : '';
  return (
    header +
    projectLine +
    `\n**DONE: (${done.length})**\n` + (done.length ? done.map((i) => `- ${i}`).join('\n') + '\n\n' : '\n') +
    `**IN-PROGRESS: (${prog.length})**\n` + (prog.length ? prog.map((i) => `- ${i}`).join('\n') + '\n\n' : '\n') +
    `**REMAINING: (${remain.length})**\n` + (remain.length ? remain.map((i) => `- ${i}`).join('\n') + '\n\n' : '\n') +
    `**NOTE: (${note.length})**\n` + (note.length ? note.map((i) => `- ${i}`).join('\n') : '')
  );
}

function renderDaily() {
  if (!$outputDaily) return; const dateStr = formatDateDisplay($dailyDate.value);
  const done = linesFromTextarea($dailyDone); const prog = linesFromTextarea($dailyInProgress);
  const remain = linesFromTextarea($dailyRemaining); const note = linesFromTextarea($dailyNote);
  const text = buildDailyText(dateStr, done, prog, remain, note);
  $outputDaily.value = text;
  if ($previewDaily) $previewDaily.innerHTML = markdownToHtml(text);
}

function persistMeta() {
  try {
    if ($dailyTeam) localStorage.setItem(STORAGE_KEYS.team, $dailyTeam.value || '');
    const pid = ($dailyProjectId && $dailyProjectId.value) || '';
    const pname = ($dailyProjectName && $dailyProjectName.value) || '';
    if ($dailyProjectId) localStorage.setItem(STORAGE_KEYS.projectId, pid);
    if ($dailyProjectName) localStorage.setItem(STORAGE_KEYS.projectName, pname);
    // Update map if both present
    if (pid.trim() && pname.trim()) {
      setProjectMapEntry(pid.trim(), pname.trim());
    }
  } catch (_) { /* ignore quota/privacy errors */ }
}

function saveProjectMap() {
  try { localStorage.setItem(STORAGE_KEYS.projectMap, JSON.stringify(projectIdToName)); } catch (_) {}
}

function getProjectNameById(id) {
  if (!id) return '';
  return projectIdToName[id] || '';
}

function setProjectMapEntry(id, name) {
  if (!id) return;
  projectIdToName[id] = name;
  saveProjectMap();
}

function showToast(message, type) {
  if (!$toast) return; $toast.textContent = message; $toast.className = `toast show ${type || ''}`;
  clearTimeout(window.__t2); window.__t2 = setTimeout(() => { $toast.className = 'toast'; $toast.textContent = ''; }, 1500);
}

function copyTextArea(ta) {
  if (!ta || !ta.value) return;
  // Persist meta and project map only when copying
  persistMeta();
  navigator.clipboard.writeText(ta.value)
    .then(() => showToast('Copied to clipboard', 'success'))
    .catch(() => showToast('Copy failed', 'error'));
}

function markdownToHtml(md) {
  // Minimal markdown renderer for this report spec: bold **text** and line breaks
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  let html = esc(md);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1<\/strong>');
  html = html.replace(/\n/g, '<br/>');
  return html;
}

// Wire
[$dailyTeam, $dailyDate, $dailyProjectId, $dailyProjectName, $dailyDone, $dailyInProgress, $dailyRemaining, $dailyNote]
  .forEach((el) => el && el.addEventListener('input', () => {
    if (!el) return;
    // Auto-fill name when typing ID (read-only from map)
    if (el === $dailyProjectId) {
      const id = $dailyProjectId.value.trim();
      const mapped = getProjectNameById(id);
      if ($dailyProjectName && mapped) $dailyProjectName.value = mapped;
    }
    // Do NOT persist to localStorage on input; only on copy
    renderDaily();
  }));
$btnDailyCopyTop && $btnDailyCopyTop.addEventListener('click', () => copyTextArea($outputDaily));

// Init
initializeDailyDefaults();
renderDaily();

// Optional: fallback inline date picker for browsers that don't show native picker on focus/click
// Always attach custom date picker to ensure consistent UX across browsers
if ($dailyDate) attachLightweightDatePicker($dailyDate);

function attachLightweightDatePicker(input) {
  let pickerEl = null;
  function close() { if (pickerEl) { pickerEl.remove(); pickerEl = null; } }
  function open() {
    close();
    const rect = input.getBoundingClientRect();
    pickerEl = document.createElement('div');
    pickerEl.className = 'datepicker';
    const now = input.value ? new Date(input.value) : new Date();
    let curYear = now.getFullYear();
    let curMonth = now.getMonth();
    const selected = input.value ? new Date(input.value) : null;
    function renderCal() {
      pickerEl.innerHTML = '';
      const header = document.createElement('header');
      const prev = document.createElement('button'); prev.textContent = '‹'; prev.className = 'btn-sm';
      const next = document.createElement('button'); next.textContent = '›'; next.className = 'btn-sm';
      const title = document.createElement('div'); title.className = 'title'; title.textContent = `${String(curMonth+1).padStart(2,'0')}/${curYear}`;
      header.append(prev, title, next); pickerEl.appendChild(header);
      const grid = document.createElement('div'); grid.className = 'grid';
      const wds = ['S','M','T','W','T','F','S'];
      wds.forEach((w) => { const wd = document.createElement('div'); wd.className = 'wd'; wd.textContent = w; grid.appendChild(wd); });
      const first = new Date(curYear, curMonth, 1);
      const startDay = first.getDay();
      const daysInMonth = new Date(curYear, curMonth+1, 0).getDate();
      for (let i=0;i<startDay;i++){ const empty = document.createElement('div'); empty.className='day'; grid.appendChild(empty); }
      for (let d=1; d<=daysInMonth; d++) {
        const day = document.createElement('div'); day.className = 'day'; day.textContent = String(d);
        const curDate = new Date(curYear, curMonth, d);
        const today = new Date();
        if (curDate.toDateString() === today.toDateString()) day.classList.add('today');
        if (selected && curDate.toDateString() === selected.toDateString()) day.classList.add('sel');
        day.addEventListener('click', () => {
          const y = curYear; const m = String(curMonth+1).padStart(2,'0'); const dd = String(d).padStart(2,'0');
          input.value = `${y}-${m}-${dd}`; input.dispatchEvent(new Event('input')); close();
        });
        grid.appendChild(day);
      }
      pickerEl.appendChild(grid);
      prev.onclick = () => { if (curMonth===0) { curMonth=11; curYear--; } else curMonth--; renderCal(); };
      next.onclick = () => { if (curMonth===11) { curMonth=0; curYear++; } else curMonth++; renderCal(); };
    }
    renderCal();
    pickerEl.style.position = 'fixed';
    pickerEl.style.left = `${rect.left + window.scrollX}px`;
    pickerEl.style.top = `${rect.bottom + 6 + window.scrollY}px`;
    document.body.appendChild(pickerEl);
    setTimeout(() => {
      const onDocClick = (e) => { if (pickerEl && !pickerEl.contains(e.target) && e.target !== input) { close(); document.removeEventListener('mousedown', onDocClick); } };
      document.addEventListener('mousedown', onDocClick);
    }, 0);
  }
  input.addEventListener('focus', open);
  input.addEventListener('click', open);
  // Prevent typing invalid text; enforce yyyy-mm-dd
  input.addEventListener('input', () => {
    const v = input.value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return;
    // allow partial typing but we don't block; render will format date display safely
  });
}


