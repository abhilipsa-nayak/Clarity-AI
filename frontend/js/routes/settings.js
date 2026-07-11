// Clarity AI — Profile & Settings View & Controller

import { updateProfile, deleteAccount, getConversations, getMessages } from '../api.js';
import { state, showToast, openModal, closeModal, applyTheme } from '../app.js';

export function renderSettingsView() {
  return `
    <div class="app-content fade-in">
      
      <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
        <h1 style="font-size: 28px; font-weight: 700;">Account Settings</h1>
        <p>Manage your profile details, reflection preferences, and data privacy.</p>
      </div>

      <div class="settings-grid">
        
        <!-- Profile Card -->
        <div class="settings-card">
          <h3 class="flex align-center gap-sm">
            <i data-lucide="user" style="color: var(--accent);"></i>
            <span>Profile Details</span>
          </h3>
          <form class="auth-form" id="settings-profile-form" style="gap: var(--spacing-md); margin-top: var(--spacing-sm);">
            <div class="form-group">
              <label class="form-label" for="settings-name">Full Name</label>
              <input type="text" id="settings-name" class="input-field" value="${state.user?.name || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="input-field" value="${state.user?.email || ''}" disabled style="background-color: var(--bg-secondary); cursor: not-allowed; opacity: 0.8;">
              <span style="font-size: 11px; color: var(--text-tertiary);">Email cannot be changed once registered.</span>
            </div>
            <button type="submit" class="btn btn--primary" id="save-profile-btn" style="align-self: flex-start;">
              <span>Update Profile</span>
            </button>
          </form>
        </div>

        <!-- Preferences Card -->
        <div class="settings-card">
          <h3 class="flex align-center gap-sm">
            <i data-lucide="sliders" style="color: var(--accent);"></i>
            <span>Thinking Preferences</span>
          </h3>
          
          <div class="form-group" style="margin-top: var(--spacing-sm);">
            <label class="form-label" for="settings-model">Preferred AI Thinking Model</label>
            <select id="settings-model" class="select-dropdown">
              <option value="gemini-2.5-flash" ${state.user?.ai_model === 'gemini-2.5-flash' ? 'selected' : ''}>Gemini 2.5 Flash (Recommended)</option>
              <option value="gemini-2.5-pro" ${state.user?.ai_model === 'gemini-2.5-pro' ? 'selected' : ''}>Gemini 2.5 Pro (Deep Reasoning)</option>
              <option value="gemini-2.0-flash" ${state.user?.ai_model === 'gemini-2.0-flash' ? 'selected' : ''}>Gemini 2.0 Flash</option>
              <option value="gemini-3.5-flash" ${state.user?.ai_model === 'gemini-3.5-flash' ? 'selected' : ''}>Gemini 3.5 Flash (Latest)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="settings-lang">App Language</label>
            <select id="settings-lang" class="select-dropdown">
              <option value="en" ${state.user?.language === 'en' ? 'selected' : ''}>English</option>
              <option value="es" ${state.user?.language === 'es' ? 'selected' : ''}>Español</option>
              <option value="fr" ${state.user?.language === 'fr' ? 'selected' : ''}>Français</option>
              <option value="de" ${state.user?.language === 'de' ? 'selected' : ''}>Deutsch</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="settings-theme">Display Theme</label>
            <select id="settings-theme" class="select-dropdown">
              <option value="light" ${state.user?.theme === 'light' ? 'selected' : ''}>Light Theme</option>
              <option value="dark" ${state.user?.theme === 'dark' ? 'selected' : ''}>Dark Theme</option>
            </select>
          </div>
        </div>

        <!-- Data Backups & Privacy Card -->
        <div class="settings-card">
          <h3 class="flex align-center gap-sm">
            <i data-lucide="shield" style="color: var(--accent);"></i>
            <span>Data Backups & Privacy</span>
          </h3>
          <p style="font-size: 14px;">Download a complete backup of all conversations, reflection metrics, and details logged under your account.</p>
          <button class="btn btn--secondary" id="export-data-btn" style="align-self: flex-start; gap: 8px;">
            <i data-lucide="download"></i>
            <span>Export Reflection History (JSON)</span>
          </button>
        </div>

        <!-- Logout / Danger Zone Card -->
        <div class="settings-card" style="border-color: rgba(239, 68, 68, 0.2);">
          <h3 class="flex align-center gap-sm" style="color: var(--error);">
            <i data-lucide="alert-triangle"></i>
            <span>Danger Zone</span>
          </h3>
          <p style="font-size: 14px;">Permanently log out or delete your account records. This action is irreversible.</p>
          
          <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-sm);">
            <button class="btn btn--secondary" id="logout-btn" style="gap: 8px;">
              <i data-lucide="log-out"></i>
              <span>Log Out</span>
            </button>
            <button class="btn btn--danger" id="delete-account-btn" style="gap: 8px;">
              <i data-lucide="user-x"></i>
              <span>Delete Account Permanently</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function initSettingsView() {
  const profileForm = document.getElementById('settings-profile-form');
  const nameInput = document.getElementById('settings-name');
  
  const modelSelect = document.getElementById('settings-model');
  const langSelect = document.getElementById('settings-lang');
  const themeSelect = document.getElementById('settings-theme');

  const exportBtn = document.getElementById('export-data-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const deleteBtn = document.getElementById('delete-account-btn');

  // Submit Profile update
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = nameInput.value.trim();
      if (!newName) return;
      
      try {
        const result = await updateProfile({ name: newName });
        state.user = result;
        showToast('Profile updated successfully', 'success');
        
        // Refresh sidebar initials / details
        const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
        const avatarEl = document.querySelector('.sidebar-user .avatar');
        const nameEl = document.querySelector('.sidebar-user__name');
        if (avatarEl) avatarEl.textContent = initials;
        if (nameEl) nameEl.textContent = newName;

      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Handle Preferences updates instantly on change
  const handlePreferenceChange = async () => {
    try {
      const selectedModel = modelSelect.value;
      const selectedLang = langSelect.value;
      const selectedTheme = themeSelect.value;
      
      const result = await updateProfile({
        ai_model: selectedModel,
        language: selectedLang,
        theme: selectedTheme
      });
      
      state.user = result;
      applyTheme(selectedTheme);
      showToast('Preferences updated', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  [modelSelect, langSelect, themeSelect].forEach(select => {
    if (select) select.addEventListener('change', handlePreferenceChange);
  });

  // Handle data export download
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      exportBtn.disabled = true;
      const originalText = exportBtn.innerHTML;
      exportBtn.innerHTML = `<span>Exporting...</span>`;
      
      try {
        const conversations = await getConversations();
        const exportObj = {
          exported_at: new Date().toISOString(),
          user: {
            name: state.user?.name,
            email: state.user?.email,
            streak: state.user?.streak
          },
          conversations: []
        };
        
        // Parallel load conversation messages
        for (const c of conversations) {
          const messages = await getMessages(c.id);
          exportObj.conversations.push({
            title: c.title,
            is_favorite: c.is_favorite,
            created_at: c.created_at,
            messages: messages.map(m => ({
              role: m.role,
              content: m.content,
              created_at: m.created_at
            }))
          });
        }
        
        // Trigger JSON file download
        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clarity_ai_reflection_history_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        
        showToast('Reflection backup downloaded successfully', 'success');

      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        exportBtn.disabled = false;
        exportBtn.innerHTML = originalText;
        lucide.createIcons();
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('clarity_token');
      state.token = null;
      state.user = null;
      state.conversations = [];
      state.activeConvId = null;
      
      applyTheme('dark'); // Restore default theme
      showToast('Logged out successfully', 'success');
      window.location.hash = '#/';
    });
  }

  // Handle Account Deletion
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      openModal(`
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h3 style="color: var(--error);">Permanently Delete Account</h3>
          <p>This action is irreversible. All of your thinking sessions, history, custom models configurations, and data will be permanently wiped from our server. Are you absolutely sure?</p>
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
            <button class="btn btn--secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
            <button class="btn btn--danger" id="confirm-delete-account-btn">Delete Account Permanently</button>
          </div>
        </div>
      `);
      
      const confirmBtn = document.getElementById('confirm-delete-account-btn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
          try {
            await deleteAccount();
            closeModal();
            
            // Wipe state
            localStorage.removeItem('clarity_token');
            state.token = null;
            state.user = null;
            state.conversations = [];
            
            applyTheme('dark');
            showToast('Account permanently deleted', 'success');
            window.location.hash = '#/signup';
          } catch (err) {
            showToast(err.message, 'error');
          }
        });
      }
    });
  }
}
