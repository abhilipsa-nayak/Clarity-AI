// Clarity AI — Chat View & Controller

import { getConversations, getMessages, sendMessage, updateConversation, deleteConversation } from '../api.js';
import { state, showToast, openModal, closeModal } from '../app.js';
import { appendMessage, showTypingIndicator, hideTypingIndicator } from '../components/chat.js';
import { getChatSkeletonHTML } from '../components/ui.js';

let activeConv = null;

export function renderChatView() {
  return `
    <div class="chat-container fade-in">
      <!-- Chat header controls -->
      <header class="app-header">
        <div class="flex align-center gap-md">
          <button class="btn--icon" onclick="window.location.hash = '#/dashboard'" aria-label="Go back to dashboard">
            <i data-lucide="arrow-left"></i>
          </button>
          <div>
            <h2 id="chat-header-title" style="font-size: 16px; font-weight: 600;">Thinking Session</h2>
            <span id="chat-header-date" style="font-size: 11px; color: var(--text-tertiary);">Reflection</span>
          </div>
        </div>
        
        <div class="flex align-center gap-sm">
          <button class="btn--icon" id="chat-favorite-btn" aria-label="Toggle Favorite">
            <i data-lucide="star"></i>
          </button>
          <button class="btn--icon" id="chat-rename-btn" aria-label="Rename session">
            <i data-lucide="edit-3"></i>
          </button>
          <button class="btn--icon" id="chat-delete-btn" aria-label="Delete session" style="color: var(--error);">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </header>

      <!-- Scrollable messages board -->
      <div class="chat-messages" id="chat-messages-board">
        ${getChatSkeletonHTML()}
      </div>

      <!-- Chat input field -->
      <footer class="chat-input-container">
        <form class="chat-input-wrapper" id="chat-input-form">
          <div class="chat-mode-select-container">
            <select id="chat-mode-selector" class="chat-mode-dropdown" aria-label="Choose chat response mode">
              <option value="default" selected>✨ Normal</option>
              <option value="reflect">💬 Reflect</option>
              <option value="focus">🎯 Focus</option>
              <option value="action">⚡ Action</option>
            </select>
          </div>
          <textarea class="chat-input" id="chat-input-field" placeholder="Ask anything or share your thoughts..." required></textarea>
          <button type="submit" class="btn btn--primary" id="chat-send-btn" style="padding: 10px; border-radius: var(--radius-sm);" aria-label="Send message">
            <i data-lucide="send" style="width: 16px; height: 16px;"></i>
          </button>
        </form>
      </footer>
    </div>
  `;
}

export async function initChatView(convId) {
  const board = document.getElementById('chat-messages-board');
  const titleHeader = document.getElementById('chat-header-title');
  const dateHeader = document.getElementById('chat-header-date');
  const favBtn = document.getElementById('chat-favorite-btn');
  const renameBtn = document.getElementById('chat-rename-btn');
  const deleteBtn = document.getElementById('chat-delete-btn');
  const form = document.getElementById('chat-input-form');
  const input = document.getElementById('chat-input-field');
  const sendBtn = document.getElementById('chat-send-btn');

  // Lock scrolling / auto textarea resize
  if (input) {
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = (input.scrollHeight - 8) + 'px';
    });
    
    // Send message on Enter (without Shift)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });
  }

  // Load details
  try {
    const conversationsList = await getConversations();
    activeConv = conversationsList.find(c => c.id === convId);
    
    if (!activeConv) {
      showToast('Conversation not found', 'error');
      window.location.hash = '#/dashboard';
      return;
    }

    // Set header information
    titleHeader.textContent = activeConv.title;
    const formattedDate = new Date(activeConv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateHeader.textContent = `Started ${formattedDate}`;
    
    // Fetch and load messages
    const messages = await getMessages(convId);
    board.innerHTML = '';
    
    const pendingKey = `pending_msg_${convId}`;
    const pendingRaw = sessionStorage.getItem(pendingKey);
    
    if (pendingRaw) {
      sessionStorage.removeItem(pendingKey);
      let pending = null;
      try { pending = JSON.parse(pendingRaw); } catch (e) {}
      
      messages.forEach(m => appendMessage(board, m.role, m.content));
      if (pending && pending.content) {
        appendMessage(board, 'user', pending.content);
        input.disabled = true;
        sendBtn.disabled = true;
        showTypingIndicator(board);
        lucide.createIcons();
        
        // Asynchronously send initial message while user sees bouncing typing dots
        sendMessage(convId, pending.content, pending.mode)
          .then(result => {
            hideTypingIndicator(board);
            appendMessage(board, 'assistant', result.assistant_message.content);
            lucide.createIcons();
          })
          .catch(err => {
            hideTypingIndicator(board);
            showToast(err.message, 'error');
          })
          .finally(() => {
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
          });
      }
    } else if (messages.length === 0) {
      board.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon"><i data-lucide="message-square"></i></div>
          <h3>Empty Thinking Session</h3>
          <p>Send a message below to start your conversation with Clarity AI.</p>
        </div>
      `;
      lucide.createIcons();
    } else {
      messages.forEach(m => appendMessage(board, m.role, m.content));
      lucide.createIcons();
    }

  } catch (err) {
    showToast(err.message, 'error');
  }

  // Header control: Toggle Favorite
  const updateFavoriteIcon = (isFav) => {
    if (!favBtn) return;
    if (isFav) {
      favBtn.style.color = 'var(--warning)';
      favBtn.innerHTML = `<i data-lucide="star" style="fill: var(--warning);"></i>`;
    } else {
      favBtn.style.color = 'var(--text-secondary)';
      favBtn.innerHTML = `<i data-lucide="star"></i>`;
    }
    lucide.createIcons();
  };

  if (favBtn) {
    updateFavoriteIcon(activeConv ? activeConv.is_favorite : false);
    favBtn.addEventListener('click', async () => {
      if (!activeConv) return;
      const targetState = !activeConv.is_favorite;
      try {
        await updateConversation(convId, { is_favorite: targetState });
        activeConv.is_favorite = targetState;
        updateFavoriteIcon(targetState);
        showToast(targetState ? 'Added to favorites' : 'Removed from favorites', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Header control: Rename Title
  if (renameBtn) {
    renameBtn.addEventListener('click', () => {
      if (!activeConv) return;
      openModal(`
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h3>Rename Conversation</h3>
          <div class="form-group">
            <input type="text" class="input-field" value="${activeConv.title}" id="rename-title-input">
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button class="btn btn--secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
            <button class="btn btn--primary" id="save-rename-btn">Save</button>
          </div>
        </div>
      `);
      
      const saveBtn = document.getElementById('save-rename-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          const inputVal = document.getElementById('rename-title-input').value.trim();
          if (!inputVal) return;
          
          try {
            await updateConversation(convId, { title: inputVal });
            activeConv.title = inputVal;
            titleHeader.textContent = inputVal;
            closeModal();
            showToast('Conversation renamed', 'success');
          } catch (err) {
            showToast(err.message, 'error');
          }
        });
      }
    });
  }

  // Header control: Delete Session
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      openModal(`
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h3>Delete Conversation</h3>
          <p>Are you sure you want to permanently delete this thinking session? This action cannot be undone.</p>
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
            <button class="btn btn--secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
            <button class="btn btn--danger" id="confirm-delete-btn">Delete Permanently</button>
          </div>
        </div>
      `);
      
      const confirmBtn = document.getElementById('confirm-delete-btn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
          try {
            await deleteConversation(convId);
            closeModal();
            showToast('Conversation deleted', 'success');
            window.location.hash = '#/dashboard';
          } catch (err) {
            showToast(err.message, 'error');
          }
        });
      }
    });
  }

  // Handle Send message
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = input.value.trim();
      if (!content) return;

      // Clean empty states if any
      const emptyState = board.querySelector('.empty-state');
      if (emptyState) emptyState.remove();

      // Append user bubble
      appendMessage(board, 'user', content);
      
      // Clear and reset textarea size
      input.value = '';
      input.style.height = 'auto';
      
      // Disable input & show typing bouncing dots
      input.disabled = true;
      sendBtn.disabled = true;
      const typingIndicator = showTypingIndicator(board);
      
      const modeSelector = document.getElementById('chat-mode-selector');
      const mode = modeSelector ? modeSelector.value : 'default';

      try {
        const result = await sendMessage(convId, content, mode);
        
        // Remove typing indicator & append coach reply
        hideTypingIndicator(board);
        appendMessage(board, 'assistant', result.assistant_message.content);
        lucide.createIcons();

      } catch (err) {
        hideTypingIndicator(board);
        showToast(err.message, 'error');
      } finally {
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
      }
    });
  }

  // Icon switcher helper
  function updateFavoriteIcon(isFav) {
    if (!favBtn) return;
    const star = favBtn.querySelector('svg') || favBtn.querySelector('i');
    if (!star) return;
    if (isFav) {
      star.style.fill = 'var(--warning)';
      star.style.color = 'var(--warning)';
    } else {
      star.style.fill = 'none';
      star.style.color = 'var(--text-secondary)';
    }
  }
}
