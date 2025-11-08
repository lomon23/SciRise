const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = {
    username: formData.get('username'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    password: formData.get('password')
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST', // важливо
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      alert('Користувача успішно створено!');
      form.reset();
    } else {
      alert('Помилка: ' + (result.error || JSON.stringify(result)));
    }
  } catch (err) {
    console.error(err);
    alert('Помилка мережі або серверу');
  }
});

