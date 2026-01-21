# 🏠 FlatFinder REST API
_A real-estate backend built with Node.js, Express, MongoDB and Docker_

This project is a fully functional backend API for managing rental flats.
It includes **authentication, authorization, messaging, CRUD operations**, and a clean **service-based architecture**.

Designed to be professional, scalable, and easy to extend.

---

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express**
- **MongoDB** (Docker container)
- **JWT Authentication**
- **Bcrypt** password hashing

### Infrastructure
- **Docker Compose** (MongoDB + Mongo Express)
- **Environment variables (.env)**

### Architecture (Layers)

```text
Models → Services → Controllers → Routes → Middleware → app.js → Server
```

Each layer has a clear single responsibility.

---

## 📦 Main Features

### 👤 Users
- Register new users
- Login and receive a JWT
- Update profile
- Delete account
- Admin-only operations
- Favourite flats field (ready for future features)

### 🏡 Flats
- Create a flat (the creator becomes the **owner**)
- List all flats
- Get a single flat by ID
- Update a flat (**only owner or admin**)
- Delete a flat (**only owner or admin**)

### 💬 Messages
- Send a message about a flat
- Get all messages for a flat (**owner or admin**)
- Get messages for a specific flat + sender (**sender or admin**)

### 🔐 Security & Roles
- JWT-based authentication
- Protected routes
- Role-based access control:
  - **Normal user**
  - **Flat owner**
  - **Admin**

---

## 🐳 Docker Setup

This project uses Docker for the database layer.

### Start containers

```bash
docker compose up -d
```

### Containers

- **MongoDB** → `localhost:27017`
- **Mongo Express** → `http://localhost:8081`
  - Username: `root`
  - Password: `example`

> 💡 The database is created automatically on first write (when a user/flat/message is created).

---

## 🔧 Environment Variables

Create a `.env` file in the project root based on the template below
(or use the provided `.env.example`):

```env
PORT=4000

# MongoDB (Docker)
MONGO_URI=mongodb://root:example@localhost:27017/flatfinder?authSource=admin

# JWT secret used to sign tokens
JWT_SECRET=your_jwt_secret_here
```

---

## ▶️ Running the Server

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:4000
```

Health-check endpoint:

```http
GET /
```

Response:

```json
{ "message": "FlatFinder API is running 🚀" }
```

---

## 📚 API Overview

### 🔐 Authentication & Users

| Method | Endpoint        | Description                          | Auth        |
|--------|-----------------|--------------------------------------|-------------|
| POST   | /users/register | Register a new user                  | ❌ Public   |
| POST   | /users/login    | Login and receive a JWT              | ❌ Public   |
| GET    | /users          | List all users (admin only)          | ✔ Admin     |
| GET    | /users/:id      | Get a user by ID                     | ✔ Token     |
| PATCH  | /users          | Update user (owner or admin)         | ✔ Token     |
| DELETE | /users          | Delete user (owner or admin)         | ✔ Token     |

#### Login Request Example

```http
POST /users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "_id": "...",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "isAdmin": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Use the token in all protected routes:

```http
Authorization: Bearer JWT_TOKEN_HERE
```

---

### 🏡 Flats

| Method | Endpoint   | Description                                      | Auth    |
|--------|------------|--------------------------------------------------|---------|
| GET    | /flats     | Get all flats                                   | ✔ Token |
| GET    | /flats/:id | Get a flat by ID                                | ✔ Token |
| POST   | /flats     | Create a flat (owner = logged-in user)          | ✔ Token |
| PATCH  | /flats     | Update flat (only owner or admin, body: flatId) | ✔ Token |
| DELETE | /flats     | Delete flat (only owner or admin, body: flatId) | ✔ Token |

---

### 💬 Messages

_All message routes are mounted under `/flats`._

| Method | Endpoint                      | Description                                   | Auth    |
|--------|-------------------------------|-----------------------------------------------|---------|
| GET    | /flats/:id/messages           | Get all messages for a flat (owner/admin)     | ✔ Token |
| GET    | /flats/:id/messages/:senderId | Get messages for a flat from a specific user  | ✔ Token |
| POST   | /flats/:id/messages           | Send a new message about a flat               | ✔ Token |

---

## 🧠 Role Behaviour (Summary)

| Role          | Capabilities                                                                 |
|---------------|------------------------------------------------------------------------------|
| Normal user   | Register, login, create flats, send messages, manage own account            |
| Flat owner    | All user actions + update/delete own flats + view messages for own flats    |
| Admin         | Full control: manage all users, all flats and can see all messages          |

---

## 🧩 Folder Structure (High-Level)

```text
project-root/
 ├── models/          # Mongoose models (User, Flat, Message)
 ├── Services/        # Business logic (User, Flat, Message services)
 ├── Controller/      # Controllers mapping requests to services
 ├── routes/          # Express routers
 ├── middleware/      # authMiddleware, errorHandler
 ├── app.js           # Express app configuration
 ├── index.js         # Server startup (connects to Mongo + listens on PORT)
 ├── docker-compose.yml
 ├── .env.example
 └── README.md
```

---

## 🧪 Suggested Manual Test Flow (Postman)

1. **Register an admin** via `POST /users/register` (`isAdmin: true`).
2. **Register a normal user** via `POST /users/register`.
3. **Login as normal user**, store the JWT.
4. **Create a flat** as the normal user via `POST /flats`.
5. **Try updating/deleting the flat**:
   - As owner → should work.
   - As another normal user → should fail (403).
   - As admin → should work.
6. **Create messages** for that flat using `POST /flats/:id/messages`.
7. **Login as owner** and call `GET /flats/:id/messages` → should see all messages.
8. **Login as sender** and call `GET /flats/:id/messages/:senderId` → should see own messages.
9. **Login as admin** and test all above to verify full access.

---

## 🟢 Health Check

```http
GET /
```

Response:

```json
{ "message": "FlatFinder API is running 🚀" }
```

---

## 🎓 Author

**Henderson Falcão Ferreira Batista**  
Full-Stack Developer (in development)  
Node.js • Express • MongoDB • Docker • REST APIs • Authentication • Software Architecture

---

🔥 _FlatFinder REST API — built with structure, clarity and real-world patterns._
