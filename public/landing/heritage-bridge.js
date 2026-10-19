(() => {
  const key = 'vien_heritage_state_v1';
  function renderProgress() {
    let state = {};
    try { state = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { /* new session */ }
    const exp = typeof state.userExp === 'number' ? state.userExp : 0;
    const checkpoints = Array.isArray(state.completedCheckpointIds) ? state.completedCheckpointIds.length : 0;
    const badges = Array.isArray(state.unlockedBadgeIds) ? state.unlockedBadgeIds.length : 0;
    const panel = document.getElementById('heritage-progress');
    panel.replaceChildren();
    const summary = document.createElement('p');
    summary.textContent = `Cấp ${Math.floor(exp / 500) + 1} · ${exp} EXP · ${checkpoints} điểm dừng · ${badges} huy hiệu`;
    panel.appendChild(summary);
    const note = document.createElement('small');
    note.textContent = 'Tiến độ lưu trên trình duyệt này. Cộng đồng và bảng xếp hạng hiện dùng dữ liệu mẫu.';
    panel.appendChild(note);
  }
  function linkDestination() {
    const card = document.querySelector('#cards [aria-current="true"]');
    const destination = window.VIEN_DATA[Number(card?.dataset.i || 0)];
    const button = document.querySelector('#detail a.btn');
    if (button && destination) {
      button.href = '/experience?destination=' + encodeURIComponent(destination.id);
      button.textContent = 'Bắt đầu trải nghiệm →';
    }
  }
  new MutationObserver(linkDestination).observe(document.getElementById('detail'), { childList: true });
  document.querySelectorAll('a[href="#cta"]').forEach(a => { a.href = '/experience'; a.textContent = 'Mở trải nghiệm'; });
  const cta = document.querySelector('#cta a');
  if (cta) cta.href = '/experience';
  const counts = document.querySelectorAll('#hero .stats [data-count]');
  if (counts[0]) { counts[0].dataset.count = window.VIEN_DATA.length; counts[0].textContent = window.VIEN_DATA.length; }
  if (counts[1]) { counts[1].dataset.count = window.VIEN_DATA[0]?.stops || 0; counts[1].textContent = window.VIEN_DATA[0]?.stops || 0; }
  window.addEventListener('pageshow', renderProgress);
  window.addEventListener('storage', renderProgress);
  linkDestination();
  renderProgress();
})();
