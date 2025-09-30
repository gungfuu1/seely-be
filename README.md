# 📦 Project API Service

NestJS backend service with PostgreSQL database (via Podman/Docker Compose).

---

## 🚀 Getting Started

### 1. Start Database (Podman / Docker Compose)
```bash
podman compose up -d
# หรือ
docker compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start API Service (Dev Mode)
```bash
   npm run start:dev
```


### 4. Test Service

Welcome endpoint: http://localhost:3000/api/v1

Swagger API Docs: http://localhost:3000/api


### ⚙️ Project Structure

src/app.module.ts → Root module

src/app.controller.ts / src/app.service.ts → Default "Hello World" route

src/item-series/ → Module สำหรับ Item Series

src/users/ → Module สำหรับ Users

src/avgr/ → Module สำหรับ Rating/Averages

###

# 🔑 Authentication

ใช้ JWT Auth และ OAuth2 (Keycloak)

Login เพื่อรับ token:

# .env

   ### Database
DATABASE_URL=postgres://postgres:seely1234@localhost:5434/seelynest

### JWT
JWT_SECRET= 
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
JWT_EXPIRES_IN=60sec

REFRESH_JWT_SECRET=
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
REFRESH_JWT_EXPIRES_IN=10min

### OAuth2 (Keycloak)
```bash
OAUTH2_ISSUER=https://sso-dev.odd.works/realms/pea-devpool-2025
OAUTH2_CLIENT_ID=wongnok
OAUTH2_CLIENT_SECRET=R6UCkSremn7nOYkNzqxJVUcVNPnG5fu7
OAUTH2_CALLBACK_URL=http://localhost:4200/login
OAUTH2_SCOPE=openid profile email
OAUTH2_POST_LOGOUT_REDIRECT_URI=http://localhost:4200/login
OAUTH2_REDIRECT_URI=http://localhost:3000/api/auth/callback/keycloak

```