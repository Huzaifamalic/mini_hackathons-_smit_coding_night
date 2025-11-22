// auth.js (Updated – Login ke baad redirect)

const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginFormEl = document.getElementById('loginForm');
const signupFormEl = document.getElementById('signupForm');

// Tab Switching
function switchTab(target) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (target === 'login') {
    loginTab.classList.add('active');
    loginFormEl.classList.remove('hidden');
    signupFormEl.classList.add('hidden');
  } else {
    signupTab.classList.add('active');
    signupFormEl.classList.remove('hidden');
    loginFormEl.classList.add('hidden');
  }
}

loginTab.addEventListener('click', () => switchTab('login'));
signupTab.addEventListener('click', () => switchTab('signup'));

// Validation Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Sign Up Handler
document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!name) return Swal.fire({icon: 'error', title: 'Oops...', text: 'Name is required!'});
  if (!emailRegex.test(email)) return Swal.fire({icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address'});
  if (!passwordRegex.test(password)) {
    return Swal.fire({
      icon: 'error',
      title: 'Weak Password',
      text: 'Password must be 8+ chars with uppercase, lowercase, number & special character'
    });
  }

  localStorage.setItem('user', JSON.stringify({ name, email, password }));

  Swal.fire({
    icon: 'success',
    title: 'Account Created!',
    text: `Welcome ${name}! Your account has been created.`,
    timer: 2000,
    showConfirmButton: false
  }).then(() => {
    switchTab('login');
    this.reset();
  });
});

// Login Handler - SUCCESS KE BAAD REDIRECT
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (user && user.email === email && user.password === password) {
    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      text: `Welcome back, ${user.name}! Redirecting...`,
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      // Ye line add ki hai – login ke baad redirect
      window.location.href = "index.html"; 
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Wrong email or password!'
    });
  }
});