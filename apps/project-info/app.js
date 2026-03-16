/* Project Info standalone script */

/** @typedef {{
 *  title: string; gameId: string; cocosVersion: string; kproject: string; scope: string;
 *  links: { drive?: string; gdd?: string; jira?: string; wbs?: string; api?: string; git?: string };
 *  gitRequestAccess: string[]; team: { pu?: string; gd?: string; pm?: string; art?: string; anim?: string; fe?: string };
 * }} ProjectInfo */

const $title = document.getElementById('title');
const $gameId = document.getElementById('gameId');
const $cocosVersion = document.getElementById('cocosVersion');
const $kproject = document.getElementById('kproject');
const $scope = document.getElementById('scope');
const $linkDrive = document.getElementById('linkDrive');
const $linkGdd = document.getElementById('linkGdd');
const $linkJira = document.getElementById('linkJira');
const $linkWbs = document.getElementById('linkWbs');
const $linkApi = document.getElementById('linkApi');
const $linkGit = document.getElementById('linkGit');
const $gitRequestAccess = document.getElementById('gitRequestAccess');
const $puSelect = document.getElementById('puSelect');
const $pm = document.getElementById('pm');
const $gdDisplay = document.getElementById('gdDisplay');
const $artDisplay = document.getElementById('artDisplay');
const $animDisplay = document.getElementById('animDisplay');
const $feDisplay = document.getElementById('feDisplay');
const $output = document.getElementById('output');
const $preview = document.getElementById('previewInfo');
const $btnCopy = document.getElementById('btnCopy');
const $btnSample = document.getElementById('btnSample');
const $btnSave = document.getElementById('btnSave');
const $btnLoad = document.getElementById('btnLoad');
const $fileLoader = document.getElementById('fileLoader');
const $toast = document.getElementById('toast');

/** Parsed CSV data */
let puData = {};

/* ─── CSV Parsing ─── */

function parseCSV(text) {
  const lines = text.trim().replace(/\r/g, '').split('\n');
  if (lines.length < 2) return {};

  const result = {};
  let currentPU = null;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const pu = cols[0]?.trim();
    const id = cols[1]?.trim();
    const member = cols[2]?.trim();
    const nickname = cols[3]?.trim();
    const team = cols[4]?.trim();
    const level = cols[5]?.trim();

    if (pu && pu !== '') currentPU = pu;
    if (!currentPU || !team) continue;
    if (currentPU === 'HoS') continue;

    if (!result[currentPU]) result[currentPU] = {};
    if (!result[currentPU][team]) result[currentPU][team] = [];

    const displayName = nickname || member;
    result[currentPU][team].push({ name: member, nickname, displayName, id, level });
  }

  return result;
}

function loadCSVResource(csvPath) {
  return fetch(csvPath, { cache: 'no-store' })
    .then((r) => r.text())
    .then((text) => {
      puData = parseCSV(text);
      return puData;
    });
}

/* ─── PU-based population ─── */

function populatePUSelect() {
  $puSelect.innerHTML = '';
  const puNames = Object.keys(puData);
  puNames.forEach((pu) => {
    const opt = document.createElement('option');
    opt.value = pu;
    opt.textContent = pu;
    $puSelect.appendChild(opt);
  });
  if (puNames.length > 0) {
    $puSelect.value = puNames[0];
    onPUChange();
  }
}

function formatMemberDisplay(members) {
  if (!members || members.length === 0) return '—';
  return members.map((m) => `${m.displayName} (${m.level})`).join(', ');
}

function onPUChange() {
  const pu = $puSelect.value;
  const data = puData[pu] || {};

  $gdDisplay.textContent = formatMemberDisplay(data['GD']);
  $artDisplay.textContent = formatMemberDisplay([...(data['Static'] || []), ...(data['UI'] || [])]);
  $animDisplay.textContent = formatMemberDisplay(data['Anim']);
  $feDisplay.textContent = formatMemberDisplay(data['FE']);

  autoGenerateGitAccess();
  render();
}

function getMembersText(members) {
  if (!members || members.length === 0) return '';
  return members.map((m) => m.displayName).join(', ');
}

function getPUTeamForOutput() {
  const pu = $puSelect.value;
  const data = puData[pu] || {};
  return {
    pu,
    gd: getMembersText(data['GD']),
    art: getMembersText([...(data['Static'] || []), ...(data['UI'] || [])]),
    anim: getMembersText(data['Anim']),
    fe: getMembersText(data['FE']),
  };
}

/** Get all FE member IDs for the selected PU */
function getFEMemberIds() {
  const pu = $puSelect.value;
  const data = puData[pu] || {};
  return (data['FE'] || []).map((m) => m.id);
}

/* ─── Discord text ─── */

function buildDiscordText(info) {
  const isNA = (v) => !v || String(v).trim().toUpperCase() === 'N/A';
  const isEmpty = (v) => !v || String(v).trim() === '';
  const SEP = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

  const lines = [];

  // Header
  lines.push(SEP);
  lines.push(`🎰  **${info.gameId}** - **${info.title}**`);
  lines.push(SEP);

  // Info block
  const infoParts = [];
  if (!isNA(info.cocosVersion)) infoParts.push(`**Cocos:** ${info.cocosVersion}`);
  if (!isNA(info.kproject)) infoParts.push(`**Kproject:** ${info.kproject}`);
  if (infoParts.length > 0) lines.push(`📋  ${infoParts.join('  ·  ')}`);

  // Scope
  if (!isEmpty(info.scope)) {
    lines.push(`🎯  **Scope:** ${info.scope}`);
  }

  // Links
  const linkChunks = [];
  if (!isEmpty(info.links.drive)) linkChunks.push(`[Drive](${info.links.drive})`);
  if (!isEmpty(info.links.gdd)) linkChunks.push(`[GDD](${info.links.gdd})`);
  if (!isEmpty(info.links.jira)) linkChunks.push(`[Jira](${info.links.jira})`);
  if (!isEmpty(info.links.wbs)) linkChunks.push(`[WBS](${info.links.wbs})`);
  if (!isEmpty(info.links.api)) linkChunks.push(`[API](${info.links.api})`);
  if (!isEmpty(info.links.git)) linkChunks.push(`[Git](${info.links.git})`);
  if (linkChunks.length > 0) {
    lines.push(`🔗  ${linkChunks.join(' · ')}`);
  }

  // Team
  lines.push('');
  if (!isNA(info.team.pu)) lines.push(`👥  **Team — ${info.team.pu}**`);

  const roleLine = (emoji, label, value) => {
    if (!isEmpty(value)) lines.push(`${emoji}  ${label}: ${value}`);
  };
  if (!isNA(info.team.pm)) roleLine('┣', '**PM**', info.team.pm);
  roleLine('┣', '**GD**', info.team.gd);
  roleLine('┣', '**Art**', info.team.art);
  roleLine('┣', '**Anim**', info.team.anim);
  roleLine('┗', '**FE**', info.team.fe);

  // Git Access
  const gitAccess = info.gitRequestAccess.join(',');
  if (gitAccess) {
    lines.push('');
    lines.push(`🔑  **Git Access:** \`${gitAccess}\``);
  }

  return lines.join('\n');
}

/* ─── Collect & Render ─── */

function collectInfo() {
  const puTeam = getPUTeamForOutput();
  /** @type {ProjectInfo} */
  const info = {
    title: $title.value.trim() || 'Khai Bút Tuân Xuân',
    gameId: $gameId.value.trim() || '0000',
    cocosVersion: $cocosVersion.value || '3.7.3',
    kproject: $kproject.value || 'N/A',
    scope: $scope.value.trim(),
    links: {
      drive: $linkDrive.value.trim(),
      gdd: $linkGdd.value.trim(),
      jira: $linkJira.value.trim(),
      wbs: $linkWbs.value.trim(),
      api: $linkApi.value.trim(),
      git: $linkGit.value.trim(),
    },
    gitRequestAccess: computeGitAccessFromInputs(),
    team: {
      pu: puTeam.pu,
      gd: puTeam.gd,
      pm: $pm.value,
      art: puTeam.art,
      anim: puTeam.anim,
      fe: puTeam.fe,
    },
  };
  return info;
}

function render() {
  const info = collectInfo();
  $output.value = buildDiscordText(info);
  $gitRequestAccess.value = info.gitRequestAccess.join(',');
  if ($preview) $preview.innerHTML = markdownToHtml($output.value);
}

function copyToClipboard() {
  if (!$output.value) return;
  navigator.clipboard.writeText($output.value)
    .then(() => { showToast('Copied output to clipboard', 'success'); })
    .catch(() => { showToast('Copy failed', 'error'); });
}

function loadSample() {
  fetch('./sample.json', { cache: 'no-store' })
    .then((r) => r.json())
    .then((sample) => {
      $title.value = sample.title;
      $gameId.value = sample.gameId;
      $cocosVersion.value = sample.cocosVersion;
      $kproject.value = sample.kproject;
      $scope.value = sample.scope || '';
      $linkDrive.value = sample.links.drive;
      $linkGdd.value = sample.links.gdd;
      $linkJira.value = sample.links.jira;
      $linkWbs.value = sample.links.wbs;
      $linkApi.value = sample.links.api;
      $linkGit.value = sample.links.git;
      if (sample.team?.pu && puData[sample.team.pu]) {
        $puSelect.value = sample.team.pu;
        onPUChange();
      }
      autoGenerateGitAccess();
      render();
    })
    .catch(() => render());
}

function loadConfigAndPopulate() {
  fetch('./config.json', { cache: 'no-store' })
    .then((r) => r.json())
    .then((cfg) => {
      window.__CFG__ = cfg;
      populateSelect($cocosVersion, cfg.cocosVersions, cfg.defaults?.cocosVersion);
      populateSelect($kproject, cfg.kprojects, cfg.defaults?.kproject);
      populateSelect($pm, cfg.roles?.pm, cfg.defaults?.pm);

      const csvPath = cfg.resourceCSV || '../../assets/Slot Planning - Ressource.csv';
      loadCSVResource(csvPath).then(() => {
        populatePUSelect();
        render();
      });
    })
    .catch(() => { render(); });
}

function populateSelect(selectEl, items = [], defaultValue) {
  selectEl.innerHTML = '';
  items.forEach((val) => {
    const opt = document.createElement('option');
    opt.value = val; opt.textContent = val; selectEl.appendChild(opt);
  });
  if (defaultValue) selectEl.value = defaultValue;
}

function computeGitAccessFromInputs() {
  const cfg = window.__CFG__ || {};
  const feGitMap = (cfg.gitAccess && cfg.gitAccess.feGitMap) || {};
  const alwaysIds = cfg.gitAccess?.alwaysIncludeIds || [];

  const feIds = getFEMemberIds();
  const allIds = Array.from(new Set([...alwaysIds, ...feIds]));
  const feTokens = allIds.map((id) => feGitMap[id] || id);

  const gitUrl = $linkGit.value.trim();
  const ownerRepo = parseOwnerRepo(gitUrl);
  const tokens = [];
  if (Array.isArray(cfg.gitAccess?.prefixTokens)) tokens.push(...cfg.gitAccess.prefixTokens);
  if (cfg.gitAccess?.ownerRepo !== false && ownerRepo) { tokens.push(ownerRepo.owner); tokens.push(ownerRepo.repo); }
  if (Array.isArray(cfg.gitAccess?.extraTokens)) tokens.push(...cfg.gitAccess.extraTokens);
  tokens.push(...feTokens);
  if (Array.isArray(cfg.gitAccess?.suffixTokens)) tokens.push(...cfg.gitAccess.suffixTokens);
  const unique = Array.from(new Set(tokens)).filter(Boolean);
  return unique;
}

function autoGenerateGitAccess() { const list = computeGitAccessFromInputs(); $gitRequestAccess.value = list.join(','); }

function copyGitAccess() {
  const v = $gitRequestAccess.value;
  if (!v) return;
  navigator.clipboard.writeText(v)
    .then(() => showToast('Git access copied!', 'success'))
    .catch(() => showToast('Copy failed', 'error'));
}

function parseOwnerRepo(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('github.com')) {
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
    }
  } catch (_) { return null; }
  return null;
}

function showToast(message, type) {
  if (!$toast) return; $toast.textContent = message; $toast.className = `toast show ${type || ''}`;
  clearTimeout(window.__t); window.__t = setTimeout(() => { $toast.className = 'toast'; $toast.textContent = ''; }, 1500);
}

function markdownToHtml(md) {
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  let html = esc(md);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1<\/strong>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1<\/a>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\n/g, '<br/>');
  return html;
}

function saveJsonToFileAndClipboard() {
  const data = collectInfo(); const json = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(json).then(() => showToast('Saved & copied JSON', 'success')).catch(() => showToast('Saved JSON (copy failed)', 'error'));
  const blob = new Blob([json], { type: 'application/json' }); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); const safeTitle = (data.title || 'project-info').replace(/[^a-z0-9-_]+/gi, '_');
  a.href = url; a.download = `${safeTitle}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function onChooseJsonFile(e) {
  const file = e.target.files && e.target.files[0]; if (!file) return; const reader = new FileReader();
  reader.onload = () => { try { const obj = JSON.parse(String(reader.result || '{}')); if (validateLoadedSchema(obj)) { applyInfoToForm(obj); autoGenerateGitAccess(); render(); showToast('Loaded JSON', 'success'); } else { showToast('Invalid JSON schema', 'error'); } } catch (_) { showToast('Invalid JSON file', 'error'); } };
  reader.readAsText(file); e.target.value = '';
}

function applyInfoToForm(info) {
  $title.value = info.title || ''; $gameId.value = info.gameId || '';
  if (info.cocosVersion) $cocosVersion.value = info.cocosVersion; if (info.kproject) $kproject.value = info.kproject;
  $scope.value = info.scope || '';
  if (info.links) { $linkDrive.value = info.links.drive || ''; $linkGdd.value = info.links.gdd || ''; $linkJira.value = info.links.jira || ''; $linkWbs.value = info.links.wbs || ''; $linkApi.value = info.links.api || ''; $linkGit.value = info.links.git || ''; }
  if (info.team) {
    if (info.team.pu && puData[info.team.pu]) {
      $puSelect.value = info.team.pu;
      onPUChange();
    }
    if (info.team.pm) $pm.value = info.team.pm;
  }
}

function validateLoadedSchema(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  if (typeof obj.title !== 'string') return false; if (typeof obj.gameId !== 'string') return false;
  if (typeof obj.cocosVersion !== 'string') return false; if (typeof obj.kproject !== 'string') return false;
  if (typeof obj.links !== 'object' || obj.links === null) return false;
  if (typeof obj.team !== 'object' || obj.team === null) return false;
  return true;
}

// Wire events
[$title, $gameId, $cocosVersion, $kproject, $scope, $linkDrive, $linkGdd, $linkJira, $linkWbs, $linkApi, $linkGit, $pm]
  .forEach((el) => el && el.addEventListener('input', () => { autoGenerateGitAccess(); render(); }));
$puSelect.addEventListener('change', onPUChange);
$gitRequestAccess.addEventListener('click', copyGitAccess);
$gitRequestAccess.style.cursor = 'pointer';
$btnCopy.addEventListener('click', copyToClipboard);
$btnSample.addEventListener('click', loadSample);
$btnSave.addEventListener('click', saveJsonToFileAndClipboard);
$btnLoad.addEventListener('click', () => $fileLoader.click());
$fileLoader.addEventListener('change', onChooseJsonFile);

// Init
loadConfigAndPopulate();
render();
