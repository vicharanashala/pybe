import { api } from '../lib/api.js';

function checkPasswordStrength(password) {
  let strength = 0;
  const feedback = [];

  if (password.length >= 8) {
    strength += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[a-z]/.test(password)) strength += 1;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) strength += 1;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) strength += 1;
  else feedback.push('Add numbers');

  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  else feedback.push('Add special characters');

  return { strength, feedback };
}

export function renderRegister(container) {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-header">
        <h2>Create Account</h2>
        <p>Join the philosophical Python learning community</p>
      </div>
      <form id="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" required placeholder="Choose a username" autocomplete="username" minlength="3" />
          <span class="field-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required placeholder="Enter your email" autocomplete="email" />
          <span class="field-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required placeholder="Create a strong password" autocomplete="new-password" minlength="6" />
          <span class="field-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <div class="password-strength" id="password-strength">
            <div class="strength-bars">
              <span class="strength-bar"></span>
              <span class="strength-bar"></span>
              <span class="strength-bar"></span>
              <span class="strength-bar"></span>
            </div>
            <span class="strength-text" id="strength-text"></span>
          </div>
          <ul class="password-requirements" id="password-requirements">
            <li data-check="length">At least 8 characters</li>
            <li data-check="lower">Contains lowercase letters</li>
            <li data-check="upper">Contains uppercase letters</li>
            <li data-check="number">Contains numbers</li>
            <li data-check="special">Contains special characters</li>
          </ul>
        </div>
        <button type="submit" class="btn btn-primary btn-full" id="register-btn">
          <span class="btn-text">Create Account</span>
          <span class="btn-loading" style="display:none">
            <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
            </svg>
            Creating account...
          </span>
        </button>
      </form>
      <p id="register-error" class="error-msg"></p>
      <p class="auth-footer">
        Already have an account? <a href="#/login" class="auth-link">Sign in</a>
      </p>
    </div>
  `;

  const form = document.getElementById('register-form');
  const errorMsg = document.getElementById('register-error');
  const registerBtn = document.getElementById('register-btn');
  const btnText = registerBtn.querySelector('.btn-text');
  const btnLoading = registerBtn.querySelector('.btn-loading');
  const passwordInput = document.getElementById('password');
  const strengthBars = document.querySelectorAll('.strength-bar');
  const strengthText = document.getElementById('strength-text');
  const requirements = document.getElementById('password-requirements');

  passwordInput.addEventListener('input', () => {
    const { strength, feedback } = checkPasswordStrength(passwordInput.value);

    const colors = ['hsl(0, 20%, 60%)', 'hsl(35, 25%, 55%)', 'hsl(45, 25%, 55%)', 'hsl(140, 30%, 55%)'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    strengthBars.forEach((bar, i) => {
      bar.style.background = i < strength ? colors[strength - 1] : 'var(--border-subtle)';
    });

    strengthText.textContent = passwordInput.value.length > 0 ? labels[strength - 1] || 'Too short' : '';
    strengthText.style.color = strength > 0 ? colors[strength - 1] : 'var(--text-muted)';

    // Update requirements checklist
    const checks = {
      length: passwordInput.value.length >= 8,
      lower: /[a-z]/.test(passwordInput.value),
      upper: /[A-Z]/.test(passwordInput.value),
      number: /[0-9]/.test(passwordInput.value),
      special: /[^a-zA-Z0-9]/.test(passwordInput.value)
    };

    requirements.querySelectorAll('li').forEach(li => {
      const check = li.dataset.check;
      li.classList.toggle('met', checks[check]);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    registerBtn.disabled = true;

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await api.auth.register(username, email, password);
      if (res.token || res.access_token) {
        api.auth.setToken(res.token || res.access_token);
        const payload = JSON.parse(atob((res.token || res.access_token).split('.')[1]));
        localStorage.setItem('user_id', payload.user_id);

        if (window.showToast) {
          window.showToast('Account created! Welcome to pyBE!', 'success');
        }
        window.location.hash = '#/dashboard';
      } else {
        window.location.hash = '#/login';
      }
    } catch (err) {
      errorMsg.textContent = err.message;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      registerBtn.disabled = false;
    }
  });

  // Add focus effects
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