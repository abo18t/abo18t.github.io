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
const $btnOpenDate = document.getElementById('btnOpenDate');

function initializeDailyDefaults() {
  const today = new Date(); const yyyy = today.getFullYear(); const mm = String(today.getMonth() + 1).padStart(2, '0'); const dd = String(today.getDate()).padStart(2, '0');
  if ($dailyDate && !$dailyDate.value) $dailyDate.value = `${yyyy}-${mm}-${dd}`;
  if ($dailyTeam && !$dailyTeam.value) $dailyTeam.value = 'FE';
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
  const projectLine = (projectId || projectName) ? `\n**PROJECT:** ${projectId}${projectId && projectName ? ' - ' : ''}${projectName}\n` : '\n';
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

function showToast(message, type) {
  if (!$toast) return; $toast.textContent = message; $toast.className = `toast show ${type || ''}`;
  clearTimeout(window.__t2); window.__t2 = setTimeout(() => { $toast.className = 'toast'; $toast.textContent = ''; }, 1500);
}

function copyTextArea(ta) {
  if (!ta || !ta.value) return;
  navigator.clipboard.writeText(ta.value).then(() => showToast('Copied to clipboard', 'success')).catch(() => showToast('Copy failed', 'error'));
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
[$dailyTeam, $dailyDate, $dailyProjectId, $dailyProjectName, $dailyDone, $dailyInProgress, $dailyRemaining, $dailyNote].forEach((el) => el && el.addEventListener('input', renderDaily));
$btnDailyCopyTop && $btnDailyCopyTop.addEventListener('click', () => copyTextArea($outputDaily));
$btnOpenDate && $btnOpenDate.addEventListener('click', () => { if ($dailyDate && $dailyDate.showPicker) { try { $dailyDate.showPicker(); return; } catch (_) {} } $dailyDate && $dailyDate.focus(); });

// Init
initializeDailyDefaults();
renderDaily();


