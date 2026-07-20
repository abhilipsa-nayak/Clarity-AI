// Clarity AI — Dashboard View & Controller

import { getConversations, createConversation, sendMessage } from '../api.js';
import { state, showToast } from '../app.js';
import { renderStreakWidget, renderSessionsWidget } from '../components/stats.js';
import { getHistorySkeletonHTML } from '../components/ui.js';

export function renderDashboard() {
  // Determine greeting based on local time
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  
  const firstName = state.user?.name ? state.user.name.split(' ')[0] : 'Thinker';

  return `
    <div class="app-content fade-in">
      
      <!-- Greeting and Header -->
      <div class="dashboard-greeting">
        <h1 style="font-size: 32px; font-weight: 700;">${greeting}, ${firstName} 👋</h1>
        <p style="font-size: 16px;">What would you like to think through today?</p>
      </div>

      <!-- Large Reflection Starter Box -->
      <div class="dashboard-search-container">
        <textarea id="reflection-input" class="dashboard-input" placeholder="Describe a problem, a decision you are facing, or what's on your mind..."></textarea>
        <div class="dashboard-footer-actions">
          <div class="dashboard-footer-left">
            <span id="reflection-char-count" class="char-count-badge">0 characters</span>
            <div class="chat-mode-select-container dashboard-mode-select">
              <select id="dashboard-mode-selector" class="chat-mode-dropdown" aria-label="Choose chat response mode">
                <option value="default" selected>✨ Normal</option>
                <option value="reflect">💬 Reflect</option>
                <option value="focus">🎯 Focus</option>
                <option value="action">⚡ Action</option>
              </select>
            </div>
          </div>
          <button class="btn btn--primary" id="start-reflecting-btn">
            <span>Start Chat</span>
            <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="dashboard-stats" id="dashboard-stats-container">
        ${renderStreakWidget(state.user?.streak || 0)}
        ${renderSessionsWidget(state.conversations.length)}
        <div class="stat-card">
          <div class="stat-card__icon" style="color: var(--success); background-color: rgba(34, 197, 94, 0.08);">
            <i data-lucide="award"></i>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__val">${state.user?.streak >= 7 ? 'Master' : 'Initiate'}</span>
            <span class="stat-card__label">Thinking Rank</span>
          </div>
        </div>
      </div>

      <!-- Recent Conversations Log -->
      <div class="recent-sessions">
        <div class="flex justify-between align-center" style="margin-bottom: var(--spacing-md);">
          <h3 style="font-size: 18px; font-weight: 600;">Recent Conversations</h3>
          <button class="btn btn--text" style="font-size: 13px; font-weight: 500;" onclick="window.location.hash = '#/history'">
            <span>View All</span>
            <i data-lucide="arrow-right" style="width: 14px; height: 14px; display: inline; vertical-align: middle;"></i>
          </button>
        </div>
        <div id="recent-sessions-container">
          ${getHistorySkeletonHTML()}
        </div>
      </div>

    </div>
  `;
}

export function initDashboard() {
  const input = document.getElementById('reflection-input');
  const counter = document.getElementById('reflection-char-count');
  const btn = document.getElementById('start-reflecting-btn');
  const recentContainer = document.getElementById('recent-sessions-container');
  const statsContainer = document.getElementById('dashboard-stats-container');

  // Input Character Counter & Enter-to-Submit listener
  if (input && counter) {
    input.addEventListener('input', () => {
      const len = input.value.length;
      counter.textContent = `${len} character${len === 1 ? '' : 's'}`;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (btn) btn.click();
      }
    });
  }

  // Dynamic Button text and icon based on selected mode
  const modeSelector = document.getElementById('dashboard-mode-selector');
  const updateDashboardButton = () => {
    if (!btn || !modeSelector) return;
    const mode = modeSelector.value;
    if (mode === 'focus') {
      btn.innerHTML = `<span>Start Focusing</span><i data-lucide="target" style="width: 16px; height: 16px;"></i>`;
    } else if (mode === 'action') {
      btn.innerHTML = `<span>Take Action</span><i data-lucide="zap" style="width: 16px; height: 16px;"></i>`;
    } else if (mode === 'reflect') {
      btn.innerHTML = `<span>Start Reflecting</span><i data-lucide="compass" style="width: 16px; height: 16px;"></i>`;
    } else {
      btn.innerHTML = `<span>Start Chat</span><i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>`;
    }
    lucide.createIcons();
  };

  if (modeSelector && btn) {
    modeSelector.addEventListener('change', updateDashboardButton);
  }

  // Handle Starter Button click
  if (btn && input) {
    btn.addEventListener('click', async () => {
      const promptText = input.value.trim();
      if (!promptText) {
        showToast('Please type a message or topic to start a conversation', 'warning');
        return;
      }

      const mode = modeSelector ? modeSelector.value : 'default';

      btn.disabled = true;
      btn.innerHTML = `<span>Opening Session...</span>`;

      try {
        // Create title based on prompt prefix (~30ms)
        const title = promptText.length > 30 ? promptText.substring(0, 30) + '...' : promptText;
        const conv = await createConversation(title);
        
        // Store pending initial message in sessionStorage for instant chat transition
        sessionStorage.setItem(`pending_msg_${conv.id}`, JSON.stringify({
          content: promptText,
          mode: mode,
          conv: conv
        }));
        
        // Redirect INSTANTLY to the new session
        window.location.hash = `#/chat/${conv.id}`;
      } catch (err) {
        showToast(err.message, 'error');
        btn.disabled = false;
        updateDashboardButton();
      }
    });
  }

  // Load Recent Conversations
  async function loadRecentConversations() {
    try {
      const list = await getConversations();
      state.conversations = list;
      
      // Update Total Sessions count widget
      if (statsContainer) {
        statsContainer.innerHTML = `
          ${renderStreakWidget(state.user?.streak || 0)}
          ${renderSessionsWidget(state.conversations.length)}
          <div class="stat-card">
            <div class="stat-card__icon" style="color: var(--success); background-color: rgba(34, 197, 94, 0.08);">
              <i data-lucide="award"></i>
            </div>
            <div class="stat-card__info">
              <span class="stat-card__val">${state.user?.streak >= 7 ? 'Master' : 'Initiate'}</span>
              <span class="stat-card__label">Thinking Rank</span>
            </div>
          </div>
        `;
        lucide.createIcons();
      }

      if (!recentContainer) return;

      const topList = list.slice(0, 3); // Get top 3 recent sessions
      
      if (topList.length === 0) {
        recentContainer.innerHTML = `
          <div class="empty-state" style="padding: var(--spacing-lg); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
            <div class="empty-state__icon" style="width: 44px; height: 44px;"><i data-lucide="compass" style="width: 20px; height: 20px;"></i></div>
            <h4 style="font-weight: 500; font-size: 14px;">Your thinking history will appear here</h4>
            <p style="font-size: 12px; max-width: 320px;">Describe what is on your mind in the textarea above to start your first coaching reflection.</p>
          </div>
        `;
        lucide.createIcons();
        return;
      }

      let html = '<div class="recent-sessions-list">';
      topList.forEach(session => {
        const dateStr = new Date(session.updated_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        html += `
          <div class="session-item" data-id="${session.id}">
            <div>
              <strong style="font-size: 14px; font-weight: 500; color: var(--text-primary); display: block;">${session.title}</strong>
              <span style="font-size: 12px; color: var(--text-tertiary);">${dateStr}</span>
            </div>
            <button class="btn--icon" aria-label="Go to session">
              <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        `;
      });
      html += '</div>';
      
      recentContainer.innerHTML = html;
      lucide.createIcons();

      // Bind session click handlers
      recentContainer.querySelectorAll('.session-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.dataset.id;
          window.location.hash = `#/chat/${id}`;
        });
      });

    } catch (err) {
      if (recentContainer) {
        recentContainer.innerHTML = `
          <div class="text-center" style="padding: var(--spacing-md); color: var(--error);">
            <p>Failed to load recent sessions: ${err.message}</p>
            <button class="btn btn--secondary" id="retry-recent-btn" style="margin-top: 8px; padding: 6px 12px; font-size: 12px;">Retry</button>
          </div>
        `;
        const retryBtn = document.getElementById('retry-recent-btn');
        if (retryBtn) retryBtn.addEventListener('click', loadRecentConversations);
      }
    }
  }

  loadRecentConversations();
}
