# Механізм авторизації (JWT)

## 1. Базова концепція
Система авторизації базується на стандарті **JWT (JSON Web Tokens)**. Використовується класична зв'язка з двох токенів: короткоживучого Access та довгоживучого Refresh. 
Авторизація є stateless (без збереження стану сесії на сервері), що дозволяє легко масштабувати бекенд і підключати різні клієнти (Web/React, Desktop/Qt).

## 2. Типи токенів та їх життєвий цикл

### Access Token
* **Формат:** JWT.
* **Термін життя (TTL):** 15 хвилин.
* **Передача:** У заголовку HTTP-запитів: `Authorization: Bearer <access_token>`.
* **Зберігання на клієнті:**
  * **React:** Тільки in-memory (змінна стану, Redux/Zustand). Ніколи не зберігати в `localStorage` через вразливість до XSS.
  * **Qt (C++):** В оперативній пам'яті (наприклад, поле класу менеджера мережі) протягом сесії.

### Refresh Token
* **Формат:** JWT 
* **Термін життя (TTL):** 7 днів.
* **Передача:** Використовується **виключно** для запиту на `/api/auth/refresh`.
* **Зберігання на клієнті:**
  * **React:** `HttpOnly`, `Secure`, `SameSite=Lax` cookie. Це захищає токен від читання через JavaScript (XSS).
  * **Qt (C++):** Локальне зашифроване сховище ОС (наприклад, через QSettings + криптографія або Keychain).

## 3. Базовий Flow авторизації

```mermaid
sequenceDiagram
    participant Client as Client (React / Qt)
    participant Auth as Auth API (Django)
    participant API as Protected API

    Note over Client, Auth: 1. Логін
    Client->>Auth: POST /login (email, password)
    Auth-->>Client: 200 OK + Access Token + Refresh Token (Cookie)
    
    Note over Client, API: 2. Звичайний запит
    Client->>API: GET /resource (Header: Bearer Access)
    API-->>Client: 200 OK (Data)
    
    Note over Client, API: 3. Access Token протух
    Client->>API: GET /resource (Header: Bearer Access)
    API-->>Client: 401 Unauthorized
    
    Note over Client, Auth: 4. Оновлення токенів (Silent Refresh)
    Client->>Auth: POST /refresh (Refresh Token)
    Auth-->>Client: 200 OK + New Access Token
    
    Note over Client, API: 5. Повторний запит
    Client->>API: GET /resource (Header: Bearer NEW Access)
    API-->>Client: 200 OK (Data)
