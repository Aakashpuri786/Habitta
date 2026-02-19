# Habitta

Habit tracker app with a Vue 3 frontend, Node/Express backend, and MongoDB.

## Stack

- Frontend: Vue 3, Vite, Pinia, Vue Router, TailwindCSS
- Backend: Node.js, Express, Mongoose, JWT
- Database: MongoDB
- Local orchestration: Docker Compose

## Run with Docker (Frontend + Backend + MongoDB)

Prerequisite: Docker Desktop installed and running.

```bash
docker compose up --build
```

This Compose setup now:
- starts MongoDB with a healthcheck
- waits for MongoDB to become healthy before backend boot
- runs `npm install` and `npm run dev` inside backend container
- runs `npm install` and `npm run dev` inside frontend container

App URLs:
- Frontend: `http://localhost:5173`
- Backend API base: `http://localhost:5000/api/v1`
- Health check: `http://localhost:5000/api/v1/health`

Stop:

```bash
docker compose down
```

Reset database volume too:

```bash
docker compose down -v
```

## Auth Flow (Sign up, Login, Redirect to Dashboard)

### Backend auth endpoints

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (protected)

### Frontend auth flow

1. User submits login/signup form in:
- `frontend/src/views/Login.vue`
- `frontend/src/views/Signup.vue`

2. Composable calls store actions:
- `frontend/src/composables/useAuth.js`
- `frontend/src/store/user.js`

3. Backend validates user and returns `{ token, user }` from:
- `backend/controllers/authController.js`

4. Frontend stores token/user in localStorage:
- `habitta-token`
- `habitta-user`

5. Frontend redirects to dashboard:
- `router.push('/dashboard')` in `frontend/src/composables/useAuth.js`

6. Router guard enforces access:
- protected routes require auth
- guest routes redirect authenticated users to dashboard
- implemented in `frontend/src/router/index.js`

7. On app boot, token is restored and user is fetched:
- `frontend/src/main.js`

## Backend Routes and Controllers

### Auth
- Routes: `backend/routes/authRoutes.js`
- Controller: `backend/controllers/authController.js`

### Users
- Routes: `backend/routes/userRoutes.js`
- Controller: `backend/controllers/userController.js`
- Includes:
  - `GET /users/me`
  - `PUT /users/me`
  - `GET /users/dashboard`
  - `POST /users/add-xp`

### Habits
- Routes: `backend/routes/habitRoutes.js`
- Controller: `backend/controllers/habitController.js`

### Tasks
- Routes: `backend/routes/taskRoutes.js`
- Controller: `backend/controllers/taskController.js`

### Challenges
- Routes: `backend/routes/challengeRoutes.js`
- Controller: `backend/controllers/challengeController.js`

All routes are mounted in `backend/server.js` under `/api/v1/*`.

## Project Structure (Current)

```text
Habitta/
  docker-compose.yml
  README.md
  backend/
    server.js
    package.json
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
  frontend/
    package.json
    vite.config.js
    src/
      components/
      composables/
      router/
      store/
      styles/
      views/
```

## Manual Run (Without Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

Required env vars for backend:
- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/habitta`
- `JWT_SECRET=your-secret`
- `JWT_EXPIRE=7d`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional frontend env:
- `VITE_API_URL=http://localhost:5000/api/v1`

