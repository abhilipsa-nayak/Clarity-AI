// Clarity AI — Authentication Views & Controllers

import { login, signup, getProfile } from '../api.js';
import { state, showToast, applyTheme, openModal, closeModal } from '../app.js';

export function renderLogin() {
  return `
    <div class="auth-page fade-in">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo" style="justify-content: center; margin-bottom: 8px;">
            <i data-lucide="compass" class="logo-icon" style="width: 28px; height: 28px;"></i>
            <span style="font-size: 22px;">Clarity AI</span>
          </div>
          <h2>Welcome back</h2>
          <p>Slow down, reflect, and make better choices.</p>
        </div>

        <form class="auth-form" id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <input type="email" id="login-email" class="input-field" placeholder="you@example.com" required autocomplete="off">
          </div>

          <div class="form-group">
            <div class="flex justify-between align-center">
              <label class="form-label" for="login-password">Password</label>
              <a href="#/login" class="auth-link" style="font-size: 13px;" id="forgot-password-link">Forgot password?</a>
            </div>
            <input type="password" id="login-password" class="input-field" placeholder="••••••••" required autocomplete="off">
          </div>

          <div class="auth-options">
            <label class="checkbox-label">
              <input type="checkbox" id="remember-me" checked style="width: 14px; height: 14px; cursor: pointer;">
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" class="btn btn--primary w-100" id="login-submit-btn">
            <span>Log In</span>
            <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
          </button>
        </form>

        <div class="social-auth">
          <button class="btn-social" onclick="window.location.hash = '#/dashboard'; alert('Logging in with Google demo mode');">
            <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div class="auth-redirect">
          <span>Don't have an account?</span>
          <a href="#/signup" class="auth-link">Sign up</a>
        </div>
      </div>
    </div>
  `;
}

export function renderSignup() {
  return `
    <div class="auth-page fade-in">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo" style="justify-content: center; margin-bottom: 8px;">
            <i data-lucide="compass" class="logo-icon" style="width: 28px; height: 28px;"></i>
            <span style="font-size: 22px;">Clarity AI</span>
          </div>
          <h2>Create account</h2>
          <p>Join a community of clearer thinkers.</p>
        </div>

        <form class="auth-form" id="signup-form">
          <div class="form-group">
            <label class="form-label" for="signup-name">Full Name</label>
            <input type="text" id="signup-name" class="input-field" placeholder="John Doe" required autocomplete="name">
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-email">Email Address</label>
            <input type="email" id="signup-email" class="input-field" placeholder="you@example.com" required autocomplete="off">
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-password">Password</label>
            <input type="password" id="signup-password" class="input-field" placeholder="••••••••" required autocomplete="off">
            
            <!-- Real-time Password Strength Indicator -->
            <div id="password-strength-container" style="display: none; flex-direction: column; gap: 6px; margin-top: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                <span style="color: var(--text-secondary);">Strength: <strong id="password-strength-label" style="color: var(--error);">Too Short</strong></span>
                <span id="password-strength-percent" style="color: var(--text-tertiary);">0%</span>
              </div>
              <div style="height: 4px; width: 100%; background-color: var(--bg-tertiary); border-radius: 2px; overflow: hidden;">
                <div id="password-strength-bar" style="height: 100%; width: 0%; background-color: var(--error); transition: width 0.3s ease, background-color 0.3s ease;"></div>
              </div>
              
              <!-- Checklist of criteria -->
              <ul style="font-size: 11px; color: var(--text-secondary); list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px; padding-left: 0;">
                <li id="rule-length" style="display: flex; align-items: center; gap: 6px; color: var(--error); transition: color var(--transition-fast);">
                  <span class="icon-status" style="font-weight: bold; margin-right: 2px;">✗</span> 8+ characters
                </li>
                <li id="rule-capital" style="display: flex; align-items: center; gap: 6px; color: var(--error); transition: color var(--transition-fast);">
                  <span class="icon-status" style="font-weight: bold; margin-right: 2px;">✗</span> Capital letter
                </li>
                <li id="rule-number" style="display: flex; align-items: center; gap: 6px; color: var(--error); transition: color var(--transition-fast);">
                  <span class="icon-status" style="font-weight: bold; margin-right: 2px;">✗</span> Numeric digit
                </li>
                <li id="rule-special" style="display: flex; align-items: center; gap: 6px; color: var(--error); transition: color var(--transition-fast);">
                  <span class="icon-status" style="font-weight: bold; margin-right: 2px;">✗</span> Special character
                </li>
              </ul>
            </div>
          </div>

          <button type="submit" class="btn btn--primary w-100" id="signup-submit-btn">
            <span>Sign Up</span>
            <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
          </button>
        </form>

        <div class="auth-redirect" style="margin-top: var(--spacing-sm);">
          <span>Already have an account?</span>
          <a href="#/login" class="auth-link">Log in</a>
        </div>
      </div>
    </div>
  `;
}

export function initLogin() {
  const form = document.getElementById('login-form');
  const submitBtn = document.getElementById('login-submit-btn');
  const forgotLink = document.getElementById('forgot-password-link');
  
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(`
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h3>Reset Password</h3>
          <p>Enter your email and we'll send you instructions to reset your password.</p>
          <div class="form-group">
            <input type="email" class="input-field" placeholder="you@example.com" id="reset-email-input">
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
            <button class="btn btn--secondary" onclick="document.getElementById('modal-close').click()">Cancel</button>
            <button class="btn btn--primary" id="send-reset-btn">Send Reset Email</button>
          </div>
        </div>
      `);
      
      const sendBtn = document.getElementById('send-reset-btn');
      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          const emailInput = document.getElementById('reset-email-input');
          const email = emailInput.value.trim();
          if (!email) {
            alert('Please enter your email address');
            return;
          }
          closeModal();
          showToast(`Password reset link sent to ${email}`, 'success');
        });
      }
    });
  }

  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      
      // Update loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Loading...</span>`;
      
      try {
        await login(email, password);
        state.token = localStorage.getItem('clarity_token');
        state.user = await getProfile();
        applyTheme(state.user.theme);
        
        showToast(`Welcome back, ${state.user.name}!`, 'success');
        window.location.hash = '#/dashboard';
      } catch (err) {
        showToast(err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
}

export function initSignup() {
  const form = document.getElementById('signup-form');
  const submitBtn = document.getElementById('signup-submit-btn');
  const passwordInput = document.getElementById('signup-password');
  
  // Real-time evaluation of password strength
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const container = document.getElementById('password-strength-container');
      
      if (password.length === 0) {
        if (container) container.style.display = 'none';
        return;
      } else {
        if (container) container.style.display = 'flex';
      }
      
      const hasLength = password.length >= 8;
      const hasCapital = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      
      const updateRuleState = (ruleId, isMet, labelText) => {
        const el = document.getElementById(ruleId);
        if (!el) return;
        
        if (isMet) {
          el.style.color = 'var(--success)';
          el.innerHTML = `<span class="icon-status" style="font-weight: bold; margin-right: 2px;">✓</span> ${labelText}`;
        } else {
          el.style.color = 'var(--error)';
          el.innerHTML = `<span class="icon-status" style="font-weight: bold; margin-right: 2px;">✗</span> ${labelText}`;
        }
      };
      
      updateRuleState('rule-length', hasLength, '8+ characters');
      updateRuleState('rule-capital', hasCapital, 'Capital letter');
      updateRuleState('rule-number', hasNumber, 'Numeric digit');
      updateRuleState('rule-special', hasSpecial, 'Special character');
      
      let score = 0;
      if (password.length > 0) {
        if (hasLength) score += 1;
        if (hasCapital) score += 1;
        if (hasNumber) score += 1;
        if (hasSpecial) score += 1;
      }
      
      const strengthBar = document.getElementById('password-strength-bar');
      const strengthLabel = document.getElementById('password-strength-label');
      const strengthPercent = document.getElementById('password-strength-percent');
      
      let width = '0%';
      let color = 'var(--error)';
      let text = 'Too Short';
      
      if (password.length === 0) {
        text = 'Too Short';
      } else if (score === 1) {
        width = '25%';
        color = 'var(--error)';
        text = 'Weak';
      } else if (score === 2) {
        width = '50%';
        color = 'var(--warning)';
        text = 'Fair';
      } else if (score === 3) {
        width = '75%';
        color = '#3B82F6'; // Slate Blue
        text = 'Good';
      } else if (score === 4) {
        width = '100%';
        color = 'var(--success)';
        text = 'Strong';
      }
      
      if (strengthBar) {
        strengthBar.style.width = width;
        strengthBar.style.backgroundColor = color;
      }
      if (strengthLabel) {
        strengthLabel.textContent = text;
        strengthLabel.style.color = color;
      }
      if (strengthPercent) {
        strengthPercent.textContent = `${score * 25}%`;
      }
    });
  }
  
  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      
      const capReg = /[A-Z]/;
      const numReg = /[0-9]/;
      const specialReg = /[^A-Za-z0-9]/;
      
      if (password.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        return;
      }
      if (!capReg.test(password)) {
        showToast('Password must contain at least one capital letter', 'error');
        return;
      }
      if (!numReg.test(password)) {
        showToast('Password must contain at least one number', 'error');
        return;
      }
      if (!specialReg.test(password)) {
        showToast('Password must contain at least one special character', 'error');
        return;
      }
      
      // Update loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Signing Up...</span>`;
      
      try {
        await signup(email, password, name);
        showToast('Account created successfully! Please log in.', 'success');
        window.location.hash = '#/login';
      } catch (err) {
        showToast(err.message, 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
}
