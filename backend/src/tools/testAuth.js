(async () => {
  try {
    const registerRes = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Auto Test', email: 'autotest+56789@example.com', password: 'AutoTest123!' }),
    });
    const registerBody = await registerRes.json().catch(() => null);
    console.log('REGISTER_STATUS', registerRes.status);
    console.log('REGISTER_BODY', JSON.stringify(registerBody));

    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'autotest+56789@example.com', password: 'AutoTest123!' }),
    });
    const loginBody = await loginRes.json().catch(() => null);
    console.log('LOGIN_STATUS', loginRes.status);
    console.log('LOGIN_BODY', JSON.stringify(loginBody));

    // Also test admin login from seed
    const adminRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sportify.com', password: 'Admin123!' }),
    });
    const adminBody = await adminRes.json().catch(() => null);
    console.log('ADMIN_LOGIN_STATUS', adminRes.status);
    console.log('ADMIN_LOGIN_BODY', JSON.stringify(adminBody));
  } catch (err) {
    console.error('ERROR', err.message || err);
    process.exit(1);
  }
})();
