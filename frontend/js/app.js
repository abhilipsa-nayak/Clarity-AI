// Clarity AI — Core SPA Application Controller

import { getProfile } from './api.js';

// Global application state
export const state = {
  token: localStorage.getItem('clarity_token') || null,
  user: null,
  activeConvId: null,
  conversations: []
};

// Check if user is authenticated
export function isAuthenticated() {
  return !!state.token;
}

// Global UI actions
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'alert-triangle';
  if (type === 'warning') icon = 'alert-circle';
  
  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  // Slide out and remove toast after 3.5s
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.2s reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, 3500);
}

// Global Modal handlers
let activeModalCloseCallback = null;

export function openModal(htmlContent, onClose = null) {
  const container = document.getElementById('modal-container');
  const contentDiv = document.getElementById('modal-content');
  if (!container || !contentDiv) return;
  
  contentDiv.innerHTML = htmlContent;
  container.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Lock background scroll
  activeModalCloseCallback = onClose;
  lucide.createIcons();
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  if (!container) return;
  
  container.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scroll
  if (activeModalCloseCallback) {
    activeModalCloseCallback();
    activeModalCloseCallback = null;
  }
}

// Setup modal bindings
document.addEventListener('DOMContentLoaded', () => {
  const modalContainer = document.getElementById('modal-container');
  const closeBtn = document.getElementById('modal-close');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  if (modalContainer) {
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
      closeModal();
    }
  });
});

// App themes manager
export function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    document.body.classList.add('dark-mode');
  }
  updateThemeIcons();
}

export function updateThemeIcons() {
  const isDark = document.body.classList.contains('dark-mode');
  
  const landingBtn = document.getElementById('theme-toggle-btn');
  if (landingBtn) {
    landingBtn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  }
  
  const landingBtnMobile = document.getElementById('theme-toggle-btn-mobile');
  if (landingBtnMobile) {
    landingBtnMobile.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  }
  
  const sidebarBtn = document.getElementById('sidebar-theme-toggle');
  if (sidebarBtn) {
    sidebarBtn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

export function toggleTheme() {
  const isDark = document.body.classList.contains('dark-mode');
  const targetTheme = isDark ? 'light' : 'dark';
  
  applyTheme(targetTheme);
  localStorage.setItem('clarity_theme', targetTheme);
  
  // Sync settings dropdown if visible
  const themeSelect = document.getElementById('settings-theme');
  if (themeSelect) {
    themeSelect.value = targetTheme;
  }
  
  if (state.user) {
    state.user.theme = targetTheme;
    // Update theme in database
    import('./api.js').then(api => {
      api.updateProfile({ theme: targetTheme }).catch(err => console.error(err));
    });
  }
}

// Expose toggleTheme globally for inline onclick handlers or cross-module access
window.ClarityAI = {
  toggleTheme,
  applyTheme
};

// Initialize theme from local storage or default to dark
const savedTheme = localStorage.getItem('clarity_theme') || 'dark';
applyTheme(savedTheme);

// Layout wrapper helpers
export function renderWithNavbar(viewContentHTML, activeTab = '') {
  return `
    <div class="landing-page fade-in" style="display: flex; flex-direction: column; min-height: 100vh;">
      <!-- Navigation Bar -->
      <header class="navbar">
        <div class="container navbar__inner">
          <div class="logo" onclick="window.location.hash = '#/'" style="cursor: pointer;">
            <i data-lucide="compass" class="logo-icon"></i>
            <span>Clarity AI</span>
          </div>
          
          <!-- Desktop Menu -->
          <nav class="nav-links desktop-only">
            <a href="#/features" class="nav-link ${activeTab === 'features' ? 'active' : ''}">Features</a>
            <a href="#/about" class="nav-link ${activeTab === 'about' ? 'active' : ''}">About</a>
            <a href="#/learn-more" class="nav-link ${activeTab === 'learn-more' ? 'active' : ''}">Learn More</a>
            <button id="theme-toggle-btn" class="btn--icon" aria-label="Toggle theme" style="margin-right: 4px;">
              <i data-lucide="sun"></i>
            </button>
            <button class="btn btn--text" onclick="window.location.hash = '#/login'">Login</button>
            <button class="btn btn--primary" onclick="window.location.hash = '#/signup'">Get Started</button>
          </nav>
          
          <!-- Mobile Navbar Controls -->
          <div class="mobile-only" style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <button id="theme-toggle-btn-mobile" class="btn--icon" aria-label="Toggle theme">
              <i data-lucide="sun"></i>
            </button>
            <button id="menu-toggle-btn" class="btn--icon" aria-label="Toggle menu">
              <i data-lucide="menu"></i>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Mobile Menu Dropdown Panel -->
      <div id="mobile-menu" class="mobile-menu-panel" style="display: none;">
        <nav style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
          <a href="#/features" class="nav-link ${activeTab === 'features' ? 'active' : ''}" style="padding-block: 8px; border-bottom: 1px solid var(--border-color); font-size: 15px;">Features</a>
          <a href="#/about" class="nav-link ${activeTab === 'about' ? 'active' : ''}" style="padding-block: 8px; border-bottom: 1px solid var(--border-color); font-size: 15px;">About</a>
          <a href="#/learn-more" class="nav-link ${activeTab === 'learn-more' ? 'active' : ''}" style="padding-block: 8px; border-bottom: 1px solid var(--border-color); font-size: 15px;">Learn More</a>
          <button class="btn btn--text" onclick="window.location.hash = '#/login'" style="justify-content: flex-start; padding-block: 8px; width: 100%;">Login</button>
          <button class="btn btn--primary" onclick="window.location.hash = '#/signup'" style="width: 100%; justify-content: center;">Get Started</button>
        </nav>
      </div>

      <div style="flex: 1;">
        ${viewContentHTML}
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="container footer__grid">
          <div>&copy; 2026 Clarity AI. Strengthening human agency.</div>
          <div class="footer-links">
            <a href="#/" style="opacity: 0.8;">Privacy Policy</a>
            <a href="#/" style="opacity: 0.8;">Terms of Service</a>
            <a href="https://github.com" target="_blank" style="opacity: 0.8;">GitHub</a>
            <a href="mailto:contact@clarity.ai" style="opacity: 0.8;">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  `;
}

function renderWithSidebar(viewContentHTML, activeTab = '') {
  const nameInitials = state.user?.name ? state.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'AI';
  
  return `
    <div class="app-layout fade-in">
      <aside class="sidebar">
        <div class="sidebar-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <div class="logo">
            <i data-lucide="compass" class="logo-icon"></i>
            <span>Clarity AI</span>
          </div>
          <button id="sidebar-theme-toggle" class="btn--icon" aria-label="Toggle theme" style="background: transparent; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: var(--radius-sm);">
            <i data-lucide="sun"></i>
          </button>
        </div>
        
        <nav class="sidebar-menu">
          <div class="sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}" onclick="window.location.hash = '#/dashboard'">
            <i data-lucide="layout-dashboard"></i>
            <span>Dashboard</span>
          </div>
          <div class="sidebar-item ${activeTab === 'history' ? 'active' : ''}" onclick="window.location.hash = '#/history'">
            <i data-lucide="clock"></i>
            <span>History</span>
          </div>
          <div class="sidebar-item ${activeTab === 'settings' ? 'active' : ''}" onclick="window.location.hash = '#/settings'">
            <i data-lucide="settings"></i>
            <span>Settings</span>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <div class="sidebar-user" onclick="window.location.hash = '#/settings'">
            <div class="avatar">${nameInitials}</div>
            <div class="sidebar-user__info">
              <div class="sidebar-user__name">${state.user?.name || 'User'}</div>
              <div style="font-size: 11px; color: var(--text-tertiary);">Streak: ${state.user?.streak || 0} 🔥</div>
            </div>
          </div>
        </div>
      </aside>
      
      <main class="app-main">
        ${viewContentHTML}
      </main>
    </div>
  `;
}

// Client-Side Router
async function handleRoute() {
  const path = window.location.hash || '#/';
  const appContainer = document.getElementById('app-container');
  
  // Close any open modals when navigating
  closeModal();

  // Authentication gatekeeper rules
  const isAuth = isAuthenticated();
  
  // Fetch user profile on startup if token exists and user is null
  if (isAuth && !state.user) {
    try {
      state.user = await getProfile();
      applyTheme(state.user.theme);
    } catch (err) {
      // Token is invalid/expired
      state.token = null;
      localStorage.removeItem('clarity_token');
      window.location.hash = '#/login';
      return;
    }
  }

  // Route definitions
  if (path === '#/' || path === '') {
    const { renderLanding, initLanding } = await import('./routes/landing.js?v=1.3');
    appContainer.innerHTML = renderWithNavbar(renderLanding(), 'home');
    initLanding();
  } 
  else if (path === '#/features') {
    const { renderFeatures, initFeatures } = await import('./routes/features.js?v=1.3');
    appContainer.innerHTML = renderWithNavbar(renderFeatures(), 'features');
    initFeatures();
  } 
  else if (path === '#/about') {
    const { renderAbout, initAbout } = await import('./routes/about.js?v=1.3');
    appContainer.innerHTML = renderWithNavbar(renderAbout(), 'about');
    initAbout();
  } 
  else if (path === '#/learn-more') {
    const { renderLearnMore, initLearnMore } = await import('./routes/learn_more.js?v=1.3');
    appContainer.innerHTML = renderWithNavbar(renderLearnMore(), 'learn-more');
    initLearnMore();
  } 
  else if (path === '#/login') {
    if (isAuth) {
      window.location.hash = '#/dashboard';
      return;
    }
    const { renderLogin, initLogin } = await import('./routes/auth.js?v=1.3');
    appContainer.innerHTML = renderLogin();
    initLogin();
  } 
  else if (path === '#/signup') {
    if (isAuth) {
      window.location.hash = '#/dashboard';
      return;
    }
    const { renderSignup, initSignup } = await import('./routes/auth.js?v=1.3');
    appContainer.innerHTML = renderSignup();
    initSignup();
  } 
  else if (path === '#/dashboard') {
    if (!isAuth) {
      window.location.hash = '#/login';
      return;
    }
    const { renderDashboard, initDashboard } = await import('./routes/dashboard.js?v=1.3');
    appContainer.innerHTML = renderWithSidebar(renderDashboard(), 'dashboard');
    initDashboard();
  } 
  else if (path.startsWith('#/chat/')) {
    if (!isAuth) {
      window.location.hash = '#/login';
      return;
    }
    const convId = path.split('#/chat/')[1];
    state.activeConvId = convId;
    const { renderChatView, initChatView } = await import('./routes/chat.js?v=1.3');
    appContainer.innerHTML = renderWithSidebar(renderChatView(), 'dashboard');
    initChatView(convId);
  } 
  else if (path === '#/history') {
    if (!isAuth) {
      window.location.hash = '#/login';
      return;
    }
    const { renderHistoryView, initHistoryView } = await import('./routes/history.js?v=1.3');
    appContainer.innerHTML = renderWithSidebar(renderHistoryView(), 'history');
    initHistoryView();
  } 
  else if (path === '#/settings') {
    if (!isAuth) {
      window.location.hash = '#/login';
      return;
    }
    const { renderSettingsView, initSettingsView } = await import('./routes/settings.js?v=1.3');
    appContainer.innerHTML = renderWithSidebar(renderSettingsView(), 'settings');
    initSettingsView();
  } 
  else {
    // 404 Fallback
    appContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon"><i data-lucide="help-circle"></i></div>
        <h3>Page Not Found</h3>
        <p>The link you followed may be broken or the page has been removed.</p>
        <button class="btn btn--primary" onclick="window.location.hash = '#/'">Return Home</button>
      </div>
    `;
  }
  
  // Bind sidebar theme toggle if it is present on the loaded page layout
  const sidebarToggle = document.getElementById('sidebar-theme-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      toggleTheme();
    });
  }
  
  // Bind navbar theme toggle if it is present on the loaded page layout
  const navbarToggle = document.getElementById('theme-toggle-btn');
  if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
      toggleTheme();
    });
  }
  
  const navbarToggleMobile = document.getElementById('theme-toggle-btn-mobile');
  if (navbarToggleMobile) {
    navbarToggleMobile.addEventListener('click', () => {
      toggleTheme();
    });
  }
  
  // Bind hamburger menu toggle
  const menuToggle = document.getElementById('menu-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = mobileMenu.style.display === 'block';
      mobileMenu.style.display = isVisible ? 'none' : 'block';
      menuToggle.innerHTML = isVisible ? '<i data-lucide="menu"></i>' : '<i data-lucide="x"></i>';
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
    
    // Close menu when clicking anywhere else
    document.addEventListener('click', (e) => {
      if (mobileMenu.style.display === 'block' && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.style.display = 'none';
        menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });
    
    // Close menu on link navigation clicks
    const mobileLinks = mobileMenu.querySelectorAll('a, button');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    });
  }
  
  // Synchronize dynamic Lucide icons for theme toggles
  updateThemeIcons();
}

// Start Application
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);
