# Habitta - Habit Tracker & Discipline Builder

A modern, motivational habit tracking platform with XP/leveling system, streaks, challenges, and gamification elements.

## Features

- ✅ Habit tracking with streaks
- ✅ Daily challenges
- ✅ XP and leveling system
- ✅ To-do list
- ✅ Rewards & micro-games
- ✅ Motivational quotes
- ✅ User authentication (JWT)
- ✅ RESTful API
- ✅ MongoDB database
- ✅ Docker deployment

## Tech Stack

### Frontend
- Vue 3
- Vite
- TailwindCSS
- Pinia (state management)
- Vue Router

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication

### Deployment
- Docker
- Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### Installation & Running

#### Option 1: Using Docker (Recommended)

```
bash
# Clone the repository
cd Habitta

# Build and run all services
docker compose up --build

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api/v1
```

#### Option 2: Manual Setup

##### Backend

```
bash
cd backend

# Install dependencies
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/habitta
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d" > .env

# Start the server
npm run dev
```

##### Frontend

```
bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
habitta/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   └── ui/
    │   ├── composables/
    │   ├── router/
    │   ├── store/
    │   ├── styles/
    │   └── views/
    ├── package.json
    └── vite.config.js
```

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register new user |
| POST | `/api/v1/auth/login` | Login user |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get current user |
| PUT | `/api/v1/users/me` | Update user profile |
| GET | `/api/v1/users/dashboard` | Get dashboard stats |

### Habits

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/habits` | Get all habits |
| POST | `/api/v1/habits` | Create habit |
| PUT | `/api/v1/habits/:id` | Update habit |
| DELETE | `/api/v1/habits/:id` | Delete habit |
| POST | `/api/v1/habits/:id/complete` | Complete habit |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get all tasks |
| POST | `/api/v1/tasks` | Create task |
| PUT | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |

### Challenges

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/challenges` | Get daily challenges |
| POST | `/api/v1/challenges/:id/complete` | Complete challenge |
| POST | `/api/v1/challenges/refresh` | Refresh challenges |

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://habitta:habitta123@mongodb:27017/habitta?authSource=admin
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
```

### Frontend

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_TITLE=Habitta
```

## Screenshots

The app features:
- Beautiful dark theme with purple/teal accents
- Animated landing page
- Dashboard with stats and progress
- Habit tracking with streaks
- Task management
- Daily challenges
- Rewards and mini-games

## License

MIT