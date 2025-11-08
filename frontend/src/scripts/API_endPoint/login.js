const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const data = {
    identifier: formData.get('identifier'),
    password: formData.get('password')
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include' // щоб сесія працювала
      
    });

    const result = await response.json();

    if (response.ok) {
      // редірект на головну
      window.location.href = './index.html';
    } else {
      alert(result.error || 'Гуляй 😎');
    }
  } catch (err) {
    console.error(err);
    alert('Помилка мережі або серверу');
  }
});