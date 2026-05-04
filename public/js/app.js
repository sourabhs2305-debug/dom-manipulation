// ── State ──
let userData = null;
let validFields = { name: false, email: false, phone: false, password: false, confirm: false };

// ── Hash-based Routing ──
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`a[href="#${page}"]`).classList.add('active');
  window.location.hash = page;
}

window.addEventListener('hashchange', () => {
  const page = window.location.hash.replace('#', '') || 'register';
  navigate(page);
});

window.addEventListener('load', () => {
  const page = window.location.hash.replace('#', '') || 'register';
  navigate(page);
});

// ── Progress Bar ──
function updateProgress() {
  const total = Object.values(validFields).filter(Boolean).length;
  const terms = document.getElementById('agreeTerms').checked;
  const score = Math.round(((total + (terms ? 1 : 0)) / 6) * 100);

  const fill = document.getElementById('progressBar');
  fill.innerHTML = `<div class="progress-fill" style="width:${score}%"></div>`;
  document.getElementById('progressText').textContent = `${score}% Complete`;
}

// ── Validation Functions ──
function validateName() {
  const val = document.getElementById('regName').value.trim();
  const msg = document.getElementById('nameMsg');
  const input = document.getElementById('regName');
  if (val.length < 3) {
    msg.textContent = '❌ Name must be at least 3 characters';
    msg.className = 'msg error';
    input.className = 'invalid';
    validFields.name = false;
  } else {
    msg.textContent = '✅ Looks good!';
    msg.className = 'msg success';
    input.className = 'valid';
    validFields.name = true;
  }
  updateProgress();
}

function validateEmail() {
  const val = document.getElementById('regEmail').value.trim();
  const msg = document.getElementById('emailMsg');
  const input = document.getElementById('regEmail');
  const valid = /^\S+@\S+\.\S+$/.test(val);
  if (!valid) {
    msg.textContent = '❌ Enter a valid email address';
    msg.className = 'msg error';
    input.className = 'invalid';
    validFields.email = false;
  } else {
    msg.textContent = '✅ Valid email!';
    msg.className = 'msg success';
    input.className = 'valid';
    validFields.email = true;
  }
  updateProgress();
}

function validatePhone() {
  const val = document.getElementById('regPhone').value.trim();
  const msg = document.getElementById('phoneMsg');
  const input = document.getElementById('regPhone');
  if (!/^\d{10}$/.test(val)) {
    msg.textContent = '❌ Enter a valid 10-digit phone number';
    msg.className = 'msg error';
    input.className = 'invalid';
    validFields.phone = false;
  } else {
    msg.textContent = '✅ Valid phone number!';
    msg.className = 'msg success';
    input.className = 'valid';
    validFields.phone = true;
  }
  updateProgress();
}

function validatePassword() {
  const val = document.getElementById('regPassword').value;
  const msg = document.getElementById('passwordMsg');
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');

  let strength = 0;
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  const levels = [
    { w: '25%', color: '#dc3545', label: 'Weak' },
    { w: '50%', color: '#fd7e14', label: 'Fair' },
    { w: '75%', color: '#ffc107', label: 'Good' },
    { w: '100%', color: '#28a745', label: 'Strong' },
  ];

  if (val.length === 0) {
    fill.style.width = '0%';
    text.textContent = '';
    validFields.password = false;
  } else {
    const l = levels[strength - 1] || levels[0];
    fill.style.width = l.w;
    fill.style.background = l.color;
    text.textContent = l.label;
    text.style.color = l.color;
    validFields.password = strength >= 3;
  }

  if (val.length < 8) {
    msg.textContent = '❌ Password must be at least 8 characters';
    msg.className = 'msg error';
    document.getElementById('regPassword').className = 'invalid';
  } else {
    msg.textContent = '✅ Good password!';
    msg.className = 'msg success';
    document.getElementById('regPassword').className = 'valid';
  }

  if (document.getElementById('regConfirm').value) validateConfirm();
  updateProgress();
}

function validateConfirm() {
  const pass = document.getElementById('regPassword').value;
  const conf = document.getElementById('regConfirm').value;
  const msg = document.getElementById('confirmMsg');
  const input = document.getElementById('regConfirm');
  if (pass !== conf) {
    msg.textContent = '❌ Passwords do not match';
    msg.className = 'msg error';
    input.className = 'invalid';
    validFields.confirm = false;
  } else {
    msg.textContent = '✅ Passwords match!';
    msg.className = 'msg success';
    input.className = 'valid';
    validFields.confirm = true;
  }
  updateProgress();
}

// ── Toggle Password Visibility ──
function togglePass(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ── Toggle Extra Fields ──
function toggleExtra() {
  const extra = document.getElementById('extraFields');
  extra.classList.toggle('hidden');
}

// ── Submit Form ──
function submitForm() {
  validateName(); validateEmail(); validatePhone();
  validatePassword(); validateConfirm();

  const allValid = Object.values(validFields).every(Boolean);
  const terms = document.getElementById('agreeTerms').checked;

  if (!allValid) { showToast('❌ Please fix all errors first!'); return; }
  if (!terms) { showToast('❌ Please agree to Terms & Conditions!'); return; }

  userData = {
    name: document.getElementById('regName').value.trim(),
    email: document.getElementById('regEmail').value.trim(),
    phone: document.getElementById('regPhone').value.trim(),
    dob: document.getElementById('regDob').value || 'Not provided',
    gender: document.getElementById('regGender').value || 'Not provided',
    joined: new Date().toLocaleString(),
  };

  updateProfile();
  showToast('🎉 Account created successfully!');
  setTimeout(() => navigate('profile'), 1500);
}

// ── Login Form ──
function validateLoginEmail() {
  const val = document.getElementById('loginEmail').value.trim();
  const msg = document.getElementById('loginEmailMsg');
  const valid = /^\S+@\S+\.\S+$/.test(val);
  msg.textContent = valid ? '✅ Valid email!' : '❌ Enter a valid email';
  msg.className = valid ? 'msg success' : 'msg error';
}

function loginForm() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) { showToast('❌ Please fill all fields!'); return; }
  showToast('✅ Login successful!');
  setTimeout(() => navigate('profile'), 1500);
}

// ── Update Profile ──
function updateProfile() {
  if (!userData) return;
  const content = document.getElementById('profileContent');
  content.innerHTML = `
    <div class="profile-card">
      <div class="profile-row">
        <span>Name</span><span>${userData.name}</span>
      </div>
      <div class="profile-row">
        <span>Email</span><span>${userData.email}</span>
      </div>
      <div class="profile-row">
        <span>Phone</span><span>${userData.phone}</span>
      </div>
      <div class="profile-row">
        <span>DOB</span><span>${userData.dob}</span>
      </div>
      <div class="profile-row">
        <span>Gender</span><span>${userData.gender}</span>
      </div>
      <div class="profile-row">
        <span>Joined</span><span>${userData.joined}</span>
      </div>
    </div>
  `;
}

// ── Toast Notification ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}