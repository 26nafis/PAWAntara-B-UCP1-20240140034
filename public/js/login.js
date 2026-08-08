document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertBox = document.getElementById('alertBox');
  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.status === 'success') {
      window.location.href = '/dashboard';
    } else {
      alertBox.className = 'alert alert-danger';
      alertBox.textContent = data.message || 'Login gagal';
      alertBox.classList.remove('d-none');
    }
  } catch (err) {
    console.error(err);
  }
});