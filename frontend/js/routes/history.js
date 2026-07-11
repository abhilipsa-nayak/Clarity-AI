// Clarity AI — History View & Controller

import { getConversations, updateConversation, deleteConversation } from '../api.js';
import { state, showToast, openModal, closeModal } from '../app.js';
import { getHistorySkeletonHTML } from '../components/ui.js';

let filterFavorites = false;
let searchQuery = '';

export function renderHistoryView() {
  return `
    <div class="app-content fade-in">
      
      <!-- Page Title & Filters -->
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
        <h1 style="font-size: 28px; font-weight: 700;">Reflection History</h1>
        <p>Review and resume your previous strategic thinking sessions.</p>
      </div>

      <!-- Filters Toolbar -->
      <div style="display: flex; gap: var(--spacing-md); width: 100%;">
        <div style="position: relative; flex: 1;">
          <input type="text" class="input-field" placeholder="Search sessions..." id="history-search-input" value="${searchQuery}" style="padding-left: 40px;">
          <i data-lucide="search" style="position: absolute; left: 14px; top: 13px; width: 16px; height: 16px; color: var(--text-tertiary);"></i>
        </div>
        <button class="btn btn--secondary" id="history-fav-toggle" style="display: flex; align-items: center; gap: 8px;">
          <i data-lucide="star" id="history-fav-icon" style="${filterFavorites ? 'fill: var(--warning); color: var(--warning);' : ''}"></i>
          <span>Favorites</span>
        </button>
      </div>

      <!-- History list results -->
      <div id="history-list-results">
        ${getHistorySkeletonHTML()}
      </div>

    </div>
  `;
}

export function initHistoryView() {
  const searchInput = document.getElementById('history-search-input');
  const favToggleBtn = document.getElementById('history-fav-toggle');
  const favIcon = document.getElementById('history-fav-icon');
  const resultsContainer = document.getElementById('history-list-results');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      loadHistoryData();
    });
  }

  if (favToggleBtn) {
    favToggleBtn.addEventListener('click', () => {
      filterFavorites = !filterFavorites;
      const activeIcon = favToggleBtn.querySelector('svg') || favToggleBtn.querySelector('i');
      if (activeIcon) {
        if (filterFavorites) {
          activeIcon.style.fill = 'var(--warning)';
          activeIcon.style.color = 'var(--warning)';
        } else {
          activeIcon.style.fill = 'none';
          activeIcon.style.color = 'var(--text-secondary)';
        }
      }
      loadHistoryData();
    });
  }

  async function loadHistoryData() {
    if (!resultsContainer) return;
    
    try {
      const conversations = await getConversations(searchQuery, filterFavorites);
      resultsContainer.innerHTML = '';

      if (conversations.length === 0) {
        let msg = 'No thinking sessions found.';
        if (searchQuery || filterFavorites) {
          msg = 'No sessions match your search filters.';
        }
        resultsContainer.innerHTML = `
          <div class="empty-state" style="padding: var(--spacing-xl); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
            <div class="empty-state__icon"><i data-lucide="clock"></i></div>
            <h3>No Sessions Found</h3>
            <p>${msg}</p>
            ${!searchQuery && !filterFavorites ? '<button class="btn btn--primary" onclick="window.location.hash = \'#/dashboard\'">Start Reflecting</button>' : ''}
          </div>
        `;
        lucide.createIcons();
        return;
      }

      // Group sessions: Today, Yesterday, Older
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      const groups = {
        'Today': [],
        'Yesterday': [],
        'Older': []
      };

      conversations.forEach(c => {
        const cDate = new Date(c.updated_at).toDateString();
        if (cDate === today) {
          groups['Today'].push(c);
        } else if (cDate === yesterday) {
          groups['Yesterday'].push(c);
        } else {
          groups['Older'].push(c);
        }
      });

      let html = '<div class="history-timeline">';

      Object.entries(groups).forEach(([groupName, sessions]) => {
        if (sessions.length === 0) return;

        html += `
          <div class="timeline-group">
            <h3 class="timeline-date">${groupName}</h3>
            <div class="recent-sessions-list">
        `;

        sessions.forEach(session => {
          const dateStr = new Date(session.updated_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          html += `
            <div class="session-item" data-id="${session.id}" style="justify-content: space-between;">
              <div class="flex-column gap-xs" style="flex: 1; margin-right: 16px;">
                <span style="font-weight: 500; font-size: 15px; color: var(--text-primary);">${session.title}</span>
                <span style="font-size: 12px; color: var(--text-tertiary);">${dateStr}</span>
              </div>
              <div class="flex align-center gap-xs" style="flex-shrink: 0;" onclick="event.stopPropagation();">
                <button class="btn--icon fav-session-btn" data-id="${session.id}" data-fav="${session.is_favorite}" aria-label="Toggle Favorite">
                  <i data-lucide="star" style="${session.is_favorite ? 'fill: var(--warning); color: var(--warning);' : ''}"></i>
                </button>
                <button class="btn--icon delete-session-btn" data-id="${session.id}" style="color: var(--error);" aria-label="Delete Session">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += '</div>';
      resultsContainer.innerHTML = html;
      lucide.createIcons();

      // Click item to go to Chat view
      resultsContainer.querySelectorAll('.session-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.dataset.id;
          window.location.hash = `#/chat/${id}`;
        });
      });

      // Handle Favorites triggers
      resultsContainer.querySelectorAll('.fav-session-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const isFav = btn.dataset.fav === 'true';
          try {
            await updateConversation(id, { is_favorite: !isFav });
            showToast(!isFav ? 'Added to favorites' : 'Removed from favorites', 'success');
            loadHistoryData();
          } catch (err) {
            showToast(err.message, 'error');
          }
        });
      });

      // Handle Deletes triggers
      resultsContainer.querySelectorAll('.delete-session-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = btn.dataset.id;
          openModal(`
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <h3>Delete Conversation</h3>
              <p>Are you sure you want to permanently delete this thinking session? This action cannot be undone.</p>
              <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
                <button class="btn btn--secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
                <button class="btn btn--danger" id="confirm-delete-history-btn">Delete Permanently</button>
              </div>
            </div>
          `);
          
          const confirmBtn = document.getElementById('confirm-delete-history-btn');
          if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
              try {
                await deleteConversation(id);
                closeModal();
                showToast('Conversation deleted', 'success');
                loadHistoryData();
              } catch (err) {
                showToast(err.message, 'error');
              }
            });
          }
        });
      });

    } catch (err) {
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="text-center" style="padding: var(--spacing-md); color: var(--error);">
            <p>Failed to load history data: ${err.message}</p>
          </div>
        `;
      }
    }
  }

  loadHistoryData();
}
