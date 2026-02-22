# А. Технічне завдання
**Мета:** Розробка кросплатформенної системи (Web + Desktop) для моніторингу погоди. Додаток повинен відображати:

- Поточну температуру, вологість та ймовірність опадів.
- Погодинний прогноз на 24 години.
- Денний прогноз на 7 днів (тиждень).

**Дизайн:**

- **Стиль:** Темна тема, мінімалізм.
- **Елементи:** Зкруглені плитки (плитки-картки), `border-radius: 12px`.
- **Колірна палітра:** Основний фон — `#1f1f1f`, акцентний/допоміжний — `#306c8c`, текст — `#ffffff`.
- **Шрифт:** Стандартний системний Monospace (для десктопа) або Sans-serif (для вебу).

# Б. Api Contract
Бекенд (Django) виступає єдиним джерелом даних для всіх фронтендів.

- **Endpoint:** `GET /weather?city=name`
- **Query Params:** `city` (string, required).
- **CORS:** Дозволити запити з `http://localhost:5173` (Vite/React). Для Qt-клієнта зазвичай обмежень немає, але `ALLOWED_HOSTS` у Django має бути налаштований.
- **Response Structure (JSON):**

JSON
```{
  "city": "String",                // Назва міста (валідована)
  "current": {
    "temp": "Number (float)",      // Температура в °C
    "humidity": "Number (int)",    // %
    "precipitation_chance": "Number (int)", // %
    "condition": "String",         // Напр. "Sunny", "Rainy"
    "advice": "String"             // Логіка від Django (що вдягнути)
  },
  "hourly": [                      // Масив (24 об'єкти)
    { "time": "String (HH:mm)", "temp": "Number (float)" }
  ],
  "daily": [                       // Масив (7 об'єктів)
    { 
      "date": "String (YYYY-MM-DD)", 
      "temp_max": "Number (float)", 
      "temp_min": "Number (float)",
      "condition": "String"
    }
  ]
}
```
![[sequence_uml.png]]


