/* Project Info standalone script */

/** @typedef {{
 *  title: string; gameId: string; cocosVersion: string; kproject: string;
 *  links: { drive?: string; gdd?: string; jira?: string; wbs?: string; api?: string; git?: string };
 *  gitRequestAccess: string[]; team: { gd?: string; pm?: string; art?: string; anim?: string; fe?: string[] };
 * }} ProjectInfo */

const $title = document.getElementById('title');
const $gameId = document.getElementById('gameId');
const $cocosVersion = document.getElementById('cocosVersion');
const $kproject = document.getElementById('kproject');
const $linkDrive = document.getElementById('linkDrive');
const $linkGdd = document.getElementById('linkGdd');
const $linkJira = document.getElementById('linkJira');
const $linkWbs = document.getElementById('linkWbs');
const $linkApi = document.getElementById('linkApi');
const $linkGit = document.getElementById('linkGit');
const $gitRequestAccess = document.getElementById('gitRequestAccess');
const $gd = document.getElementById('gd');
const $pm = document.getElementById('pm');
const $art = document.getElementById('art');
const $anim = document.getElementById('anim');
const $feContainer = document.getElementById('feContainer');
const $output = document.getElementById('output');
const $btnCopy = document.getElementById('btnCopy');
const $btnSample = document.getElementById('btnSample');
const $btnSave = document.getElementById('btnSave');
const $btnLoad = document.getElementById('btnLoad');
const $fileLoader = document.getElementById('fileLoader');
const $toast = document.getElementById('toast');

function buildDiscordText(info) {
  const isNA = (v) => !v || String(v).trim().toUpperCase() === 'N/A';

  // Links, skip N/A
  const linkChunks = [];
  if (!isNA(info.links.drive)) linkChunks.push(`[Drive](${info.links.drive})`);
  if (!isNA(info.links.gdd)) linkChunks.push(`[GDD](${info.links.gdd})`);
  if (!isNA(info.links.jira)) linkChunks.push(`[Jira](${info.links.jira})`);
  if (!isNA(info.links.wbs)) linkChunks.push(`[WBS](${info.links.wbs})`);
  if (!isNA(info.links.api)) linkChunks.push(`[API](${info.links.api})`);
  if (!isNA(info.links.git)) linkChunks.push(`[Git](${info.links.git})`);

  // Version/Kproject line (compose only non-NA)
  const versionRowParts = [];
  if (!isNA(info.cocosVersion)) versionRowParts.push(`Cocos Version: ${info.cocosVersion}`);
  if (!isNA(info.kproject)) versionRowParts.push(`Kproject: ${info.kproject}`);

  // Team line
  const teamParts = [];
  if (!isNA(info.team.gd)) teamParts.push(`GD: ${info.team.gd}`);
  if (!isNA(info.team.pm)) teamParts.push(`PM: ${info.team.pm}`);
  if (!isNA(info.team.art)) teamParts.push(`Art: ${info.team.art}`);
  if (!isNA(info.team.anim)) teamParts.push(`Anim: ${info.team.anim}`);
  const feList = info.team.fe && info.team.fe.length > 0 ? info.team.fe.map((n) => `@${n.trim()}`).join(' , ') : '';
  if (feList) teamParts.push(`FE:  ${feList}`);

  const lines = [];
  lines.push(`=== **${info.title}** ===`);
  lines.push(`- Game ID: **${info.gameId}**`);
  if (versionRowParts.length > 0) lines.push(`- ${versionRowParts.join('  |  ')}`);
  if (linkChunks.length > 0) lines.push(`- Link: ${linkChunks.join(' | ')}`);
  const gitAccess = info.gitRequestAccess.join(',');
  lines.push(`- Git request access: ${gitAccess}${gitAccess ? '' : ''}`);
  if (teamParts.length > 0) lines.push(`- ${teamParts.join('   |   ')}`);

  return lines.join('\n');
}

function collectInfo() {
  /** @type {ProjectInfo} */
  const info = {
    title: $title.value.trim() || 'Khai Bút Tuân Xuân',
    gameId: $gameId.value.trim() || '0000',
    cocosVersion: $cocosVersion.value || '3.7.3',
    kproject: $kproject.value || 'N/A',
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
      gd: $gd.value,
      pm: $pm.value,
      art: $art.value,
      anim: $anim.value,
      fe: getSelectedFENames(),
    },
  };
  return info;
}

function render() {
  const info = collectInfo();
  $output.value = buildDiscordText(info);
  $gitRequestAccess.value = info.gitRequestAccess.join(',');
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
      $linkDrive.value = sample.links.drive;
      $linkGdd.value = sample.links.gdd;
      $linkJira.value = sample.links.jira;
      $linkWbs.value = sample.links.wbs;
      $linkApi.value = sample.links.api;
      $linkGit.value = sample.links.git;
      setCheckedFE(sample.team.fe);
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
      populateSelect($gd, cfg.roles?.gd, cfg.defaults?.gd);
      populateSelect($pm, cfg.roles?.pm, cfg.defaults?.pm);
      populateSelect($art, cfg.roles?.art, cfg.defaults?.art);
      populateSelect($anim, cfg.roles?.anim, cfg.defaults?.anim);
      populateFECheckboxes(cfg.roles?.fe || []);
      render();
    })
    .catch(() => { render(); });
}

function populateSelect(selectEl, items = [], defaultValue, isMulti = false) {
  selectEl.innerHTML = '';
  items.forEach((val) => {
    const opt = document.createElement('option');
    opt.value = val; opt.textContent = val; selectEl.appendChild(opt);
  });
  if (!isMulti && defaultValue) selectEl.value = defaultValue;
}

function populateFECheckboxes(feNames) {
  $feContainer.innerHTML = '';
  feNames.forEach((name, idx) => {
    const id = `fe_${idx}`;
    const wrapper = document.createElement('div');
    wrapper.className = 'checkbox-item';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = id; cb.value = name;
    const label = document.createElement('label'); label.setAttribute('for', id); label.textContent = name;
    wrapper.appendChild(cb); wrapper.appendChild(label); $feContainer.appendChild(wrapper);
    cb.addEventListener('change', () => { autoGenerateGitAccess(); render(); });
  });
}

function getSelectedFENames() {
  return Array.from($feContainer.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
}

function setCheckedFE(list) {
  const set = new Set(list);
  $feContainer.querySelectorAll('input[type="checkbox"]').forEach((el) => { el.checked = set.has(el.value); });
}

function computeGitAccessFromInputs() {
  const cfg = window.__CFG__ || {};
  const feGitMap = (cfg.gitAccess && cfg.gitAccess.feGitMap) || {};
  const feListRaw = getSelectedFENames();
  const feTokens = feListRaw.map((name) => feGitMap[name.trim()] || name.trim());
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
  if (info.links) { $linkDrive.value = info.links.drive || ''; $linkGdd.value = info.links.gdd || ''; $linkJira.value = info.links.jira || ''; $linkWbs.value = info.links.wbs || ''; $linkApi.value = info.links.api || ''; $linkGit.value = info.links.git || ''; }
  if (info.team) { if (info.team.gd) $gd.value = info.team.gd; if (info.team.pm) $pm.value = info.team.pm; if (info.team.art) $art.value = info.team.art; if (info.team.anim) $anim.value = info.team.anim; if (Array.isArray(info.team.fe)) setCheckedFE(info.team.fe); }
}

function validateLoadedSchema(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  if (typeof obj.title !== 'string') return false; if (typeof obj.gameId !== 'string') return false;
  if (typeof obj.cocosVersion !== 'string') return false; if (typeof obj.kproject !== 'string') return false;
  if (typeof obj.links !== 'object' || obj.links === null) return false; if (typeof obj.links.git !== 'string') return false;
  if (typeof obj.team !== 'object' || obj.team === null) return false; if (typeof obj.team.gd !== 'string') return false;
  if (typeof obj.team.pm !== 'string') return false; if (typeof obj.team.art !== 'string') return false; if (typeof obj.team.anim !== 'string') return false; if (!Array.isArray(obj.team.fe)) return false; return true;
}

// Wire events
[$title, $gameId, $cocosVersion, $kproject, $linkDrive, $linkGdd, $linkJira, $linkWbs, $linkApi, $linkGit, $gd, $pm, $art, $anim]
  .forEach((el) => el && el.addEventListener('input', () => { autoGenerateGitAccess(); render(); }));
$btnCopy.addEventListener('click', copyToClipboard);
$btnSample.addEventListener('click', loadSample);
$btnSave.addEventListener('click', saveJsonToFileAndClipboard);
$btnLoad.addEventListener('click', () => $fileLoader.click());
$fileLoader.addEventListener('change', onChooseJsonFile);

// Init
loadConfigAndPopulate();
render();


