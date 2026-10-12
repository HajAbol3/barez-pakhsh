const form = document.getElementById('loginForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const togglePass = document.getElementById('togglePass');
const passIcon = document.getElementById('passIcon');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const loginCard = document.getElementById('loginCard');
const fieldUser = document.getElementById('fieldUser');
const fieldPass = document.getElementById('fieldPass');

function bindFocus(field, input) {
  input.addEventListener('focus', () => field.classList.add('focused'));
  input.addEventListener('blur', () => field.classList.remove('focused'));
}
bindFocus(fieldUser, username);
bindFocus(fieldPass, password);

togglePass.addEventListener('click', () => {
  const show = password.type === 'password';
  password.type = show ? 'text' : 'password';
  passIcon.className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
});

const DEMO_USERS = [
  { username: 'admin', password: '123456', id: 1, name: 'مدیر سیستم', role: 'admin' },
  { username: 'sara', password: '123456', id: 2, name: 'سارا محمدی', role: 'staff' }
];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loginError.hidden = true;

  const userVal = username.value.trim();
  const passVal = password.value;

  if (!userVal || !passVal) {
    showError('نام کاربری و رمز عبور را وارد کنید');
    return;
  }

  loginBtn.classList.add('loading');
  loginBtn.querySelector('.btn-text').hidden = true;
  loginBtn.querySelector('.btn-loader').hidden = false;

  setTimeout(() => {
    const found = DEMO_USERS.find(
      u => u.username === userVal && u.password === passVal
    );

    if (!found) {
      loginBtn.classList.remove('loading');
      loginBtn.querySelector('.btn-text').hidden = false;
      loginBtn.querySelector('.btn-loader').hidden = true;
      showError('نام کاربری یا رمز عبور اشتباه است');
      return;
    }

    localStorage.setItem('barez_currentUser', JSON.stringify({
      id: found.id,
      name: found.name,
      role: found.role
    }));

    if (document.getElementById('remember')?.checked) {
      localStorage.setItem('barez_remember', userVal);
    }

    loginCard.classList.add('success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 450);
  }, 900);
});

function showError(msg) {
  loginError.textContent = msg;
  loginError.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  const remembered = localStorage.getItem('barez_remember');
  if (remembered) {
    username.value = remembered;
    document.getElementById('remember').checked = true;
  }
});