import { api } from '../lib/api.js';

export function renderLogin(container) {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue your philosophical Python journey</p>
      </div>
      <form id="login-form">
        <div class="form-group">
          <label for="email">Email or Username</label>
          <input type="text" id="email" required placeholder="Enter your email or username" autocomplete="email" />
          <span class="field-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required placeholder="Enter your password" autocomplete="current-password" />
          <span class="field-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
        </div>
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" id="remember" />
            <span class="checkmark"></span>
            Remember me
          </label>
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>
        <button type="submit" class="btn btn-primary btn-full" id="login-btn">
          <span class="btn-text">Sign In</span>
          <span class="btn-loading" style="display:none">
            <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
            </svg>
            Signing in...
          </span>
        </button>
      </form>
      <p id="login-error" class="error-msg"></p>
      <p class="auth-footer">
        Don't have an account? <a href="#/register" class="auth-link">Create one</a>
      </p>
    </div>
  `;

  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');
  const btnText = loginBtn.querySelector('.btn-text');
  const btnLoading = loginBtn.querySelector('.btn-loading');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    loginBtn.disabled = true;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await api.auth.login(email, password);
      api.auth.setToken(res.token || res.access_token);
      const payload = JSON.parse(atob((res.token || res.access_token).split('.')[1]));
      localStorage.setItem('user_id', payload.user_id);
      if (res.user && res.user.isAdmin) {
        localStorage.setItem('is_admin', 'true');
      }

      if (window.showToast) {
        window.showToast('Welcome back! Ready to learn?', 'success');
      }
      window.location.hash = '#/dashboard';
    } catch (err) {
      errorMsg.textContent = err.message;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      loginBtn.disabled = false;
    }
  });

  // Add focus effects for visual feedback
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

  return () => {};
}