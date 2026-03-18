# Auth API Contract (v1.0)

**Base URL:** `/api/auth/`
**Content-Type:** `application/json`

---

## 1. Реєстрація (Register)
Створення нового користувача.

    URL: `/register/`
    Method: `POST`
    Auth required: No

**Request Body:**
```json
{
  "email": "user@scirise.com",
  "username": "developer1",
  "password": "StrongPassword123!"
}
```
### Response: 201 Created
```json
{
  "id": 1,
  "email": "user@scirise.com",
  "username": "developer1",
  "message": "User successfully created."
}
```
### Response: 400 Bad Request (Приклад помилки валідації)
```json
{
  "email": ["This email is already in use."],
  "password": ["Password is too common."]
}
```
## 2. Логін (Login)

Отримання пари токенів. Для React клієнта refresh токен також має дублюватися в Set-Cookie (HttpOnly, Secure). Для Postman та Qt клієнта токени беруться з тіла відповіді.

    URL: /login/
    Method: POST
    Auth required: No

Request Body:
```json
{
  "email": "user@scirise.com",
  "password": "StrongPassword123!"
}
```
### Response: 200 OK
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```
(Headers мають містити: Set-Cookie: refresh=eyJhb...; HttpOnly; Path=/api/auth/refresh/; Secure; SameSite=Lax)
### Response: 401 Unauthorized
```json
{
  "detail": "No active account found with the given credentials"
}
```
## 3. Оновлення токена (Refresh)

Отримання нового Access токена. Бекенд має приймати refresh токен або з тіла запиту (пріоритет для Postman/Qt), або з куки (для React).

    URL: /refresh/
    Method: POST
    Auth required: No
    
```json
Request Body: (Postman/Qt)
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```
Response: 200 OK
```json
{
  "access": "NEW_eyJhbGciOiJIUzI1NiIsInR5..."
}
```
Response: 401 Unauthorized (Якщо Refresh протух або невалідний)
```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

## 4. Вихід (Logout)

Блеклістинг Refresh токена на стороні сервера, щоб його більше не можна було використати.

    URL: /logout/
    Method: POST
    Auth required: Yes (Header: Authorization: Bearer <access_token>)

Request Body:
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```
Response: 205 Reset Content (Або 200 OK)
```json
{
  "message": "Successfully logged out."
}
```
(Якщо клієнт React, бекенд також має надіслати заголовок для видалення куки: Set-Cookie: refresh=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/api/auth/refresh/)

---
## Інструкція для QA (Postman)

Макс, щоб нормально це тестувати, не копіюй токени руками:
    Створи Environment у Postman (наприклад, SciRise Local).
    В запиті Login у вкладці Tests додай скрипт, який автоматично зберігатиме токени у змінні:
    
```JavaScript
if (pm.response.code === 200) {
    pm.environment.set("access_token", pm.response.json().access);
    pm.environment.set("refresh_token", pm.response.json().refresh);
}
```
У всіх захищених ендпоінтах (і в Logout) у вкладці Authorization вибирай тип Bearer Token і вставляй змінну {{access_token}}.
