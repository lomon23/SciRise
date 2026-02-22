
**Твоя задача** — створити проксі-сервер, який прийматиме запити від фронтендів, оброблятиме дані з зовнішнього API та повертатиме чистий JSON.

## 1. Стек та залежності

Встанови необхідні пакети:
```
pip install django djangorestframework django-cors-headers requests
```

- **djangorestframework** — для створення API.
- **django-cors-headers** — критично для Саші (React), щоб уникнути помилок CORS.    
- **requests** — для запитів до Open-Meteo.

## 2. Налаштування (settings.py)
Тобі потрібно "подружити" бекенд з фронтендом:

- Додай `corsheaders` у `INSTALLED_APPS`.
- Додай `corsheaders.middleware.CorsMiddleware` у самий початок `MIDDLEWARE`.
- Додай дозвіл для React:
```
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Порт React (Vite)
]
```
## 3. Логіка Ендпоінту (views.py)

Твій єдиний маршрут: `GET /weather?city=name`.

**Твій алгоритм всередині View:**

1. **Геокодинг**: Використовуй `https://geocoding-api.open-meteo.com/v1/search?name={city}`. Отримай `latitude` та `longitude`.

2. **Запит погоди**: Стукай в `api.open-meteo.com` з отриманими координатами. Тобі потрібні параметри `current_weather=true`, `hourly=temperature_2m` та `daily`.

3. **Формування поради (Advice Logic)**:
	- Якщо `temp < 10` — "Одягни теплу куртку".
	- Якщо `precipitation_chance > 50` — "Візьми парасольку".

4. **Відповідь**: Збери все у JSON структуру, яку ми затвердили в `base`.
# 4. Структура файлів проекту
```
backend/
├── weather_project/      # Налаштування (settings.py, urls.py)
└── weather_app/          # Твоя логіка
    ├── views.py          # Основна обробка
    ├── services.py       # (Рекомендовано) Винеси сюди логіку запитів до API
    └── urls.py           # Маршрут до /weather
```

## 5. Обробка помилок

Якщо місто не знайдено або API лежить, ти маєш повертати:

- `status=404` для неіснуючих міст.
- `status=400` якщо поле `city` порожнє.