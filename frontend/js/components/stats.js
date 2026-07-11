// Clarity AI — Stats & Engagement Indicators

export function renderStreakWidget(streakCount) {
  let message = 'Start thinking today!';
  if (streakCount > 0 && streakCount < 3) {
    message = 'Nice start! Keep it up.';
  } else if (streakCount >= 3 && streakCount < 7) {
    message = 'You are building a habit! 🔥';
  } else if (streakCount >= 7) {
    message = 'Mindfulness master! Incredible streak! 🚀';
  }
  
  return `
    <div class="stat-card">
      <div class="stat-card__icon" style="color: var(--warning); background-color: rgba(245, 158, 11, 0.08);">
        <i data-lucide="zap"></i>
      </div>
      <div class="stat-card__info">
        <span class="stat-card__val">${streakCount} ${streakCount === 1 ? 'day' : 'days'}</span>
        <span class="stat-card__label">${message}</span>
      </div>
    </div>
  `;
}

export function renderSessionsWidget(totalSessions) {
  return `
    <div class="stat-card">
      <div class="stat-card__icon" style="color: var(--accent); background-color: var(--accent-light);">
        <i data-lucide="activity"></i>
      </div>
      <div class="stat-card__info">
        <span class="stat-card__val">${totalSessions}</span>
        <span class="stat-card__label">Total Reflective Sessions</span>
      </div>
    </div>
  `;
}
