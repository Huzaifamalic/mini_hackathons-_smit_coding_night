// auth.js - 100% Working
function togglePass(id, btn) {
  const input = document.getElementById(id);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    icon.setAttribute('data-lucide', 'eye');
  }
  lucide.createIcons();
}

document.getElementById('loginTab').onclick = () => { document.getElementById('loginForm').classList.remove('hidden'); document.getElementById('signupForm').classList.add('hidden'); }
document.getElementById('signupTab').onclick = () => { document.getElementById('signupForm').classList.remove('hidden'); document.getElementById('loginForm').classList.add('hidden'); }

// Users
let users = JSON.parse(localStorage.getItem('users') || '[]');

document.getElementById('signup-form').onsubmit = e => {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const pass = document.getElementById('signupPassword').value;

  if (users.some(u => u.email === email)) return Swal.fire('Error', 'Email already exists!', 'error');
  if (pass.length < 8) return Swal.fire('Error', 'Password must be 8+ characters!', 'error');

  users.push({ name, email, password: pass });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify({ name, email }));
  Swal.fire('Success!', 'Account created!', 'success').then(() => location.href = 'dashboard.html');
};

document.getElementById('login-form').onsubmit = e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value;
  const user = users.find(u => u.email === email && u.password === pass);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    location.href = 'post.html';
  } else {
    Swal.fire('Error', 'Wrong email or password!', 'error');
  }
};