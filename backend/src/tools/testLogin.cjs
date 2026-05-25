(async () => {
  try {
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sportify.com', password: 'admin123' }),
      credentials: 'include',
    });
    console.log('STATUS', res.status);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
