Твоя задача — розробити десктопний клієнт, використовуючи **Qt6** Проєкт має бути побудований за модульним принципом, який ми використовуємо в **Academic OS**.

## 1. Структура проєкту та CMake

Ти маєш розділити логіку на два основні модулі: `WeatherNetwork` та `WeatherUI`.

**CMakeLists.txt:** Обов'язково підключи компоненти `Network` та `Widgets`. Не забудь про `set(CMAKE_AUTOMOC ON)`.

## 2. Модуль WeatherNetwork (Backend-client)

Цей клас відповідає за комунікацію з Django.

- **Клас**: Нащадок `QObject`.
- **Інструментарій**: `QNetworkAccessManager`, `QNetworkReply`.
- **Завдання**:
    
    1. Відправити `GET` запит на `http://localhost:8000/weather?city=...`.
    2. Отримати `QByteArray` та перетворити його на `QJsonDocument`.
    3. Емітувати сигнал `dataReady(QJsonObject)` або `errorOccurred(QString)`.

## 3. Модуль WeatherUI (Frontend)

Тут ти будуєш інтерфейс згідно з дизайном у `base`.

- **Стилізація**: Використовуй **QSS (Qt Style Sheets)**.
    - Фон: `#1f1f1f`.
    - Плитки: `#306c8c` зі зкругленням `border-radius: 12px`.
- **Компоненти**:
    - `QLineEdit` для вводу міста.
    - `QScrollArea` — обов'язково, бо прогноз на 24 години та 7 днів не влізе в статичне вікно.
    - Побудуй кастомний віджет `WeatherCard` для відображення дня тижня.

## 4. Парсинг JSON (Критично)

Django повертає складну структуру. Будь уважним з типами:
```
// Приклад парсингу в WeatherNetwork.cpp
QJsonObject current = rootObj["current"].toObject();
double temp = current["temp"].toDouble(); // Міша віддає float
QString advice = current["advice"].toString();
```
## 5. Архітектурні вимоги

- **Ніякої логіки в main.cpp**: Тільки ініціалізація `QApplication` та з'єднання сигналів/слотів між модулями.
- **Асинхронність**: Не блокуй GUI потік під час запиту. Використовуй лямбди або слоти для обробки завершення запиту.
- **Headers**: Використовуй forward declarations (`class QNetworkAccessManager;`) у хедер-файлах для прискорення компіляції.

---
