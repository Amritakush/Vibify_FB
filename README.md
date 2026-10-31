# Vibify

Vibify is a mood-based music discovery web app. Pick a mood, browse songs by language or artist, and search the catalogue. Songs play through YouTube's official embedded player.

**Stack:** React + Vite (frontend), Node.js + Express (backend), MongoDB + Mongoose (database), Redux Toolkit, JWT auth in an httpOnly cookie.

## Current status

Working:
- Register, login, logout (passwords hashed with bcrypt, session in an httpOnly cookie)
- Songs API with mood, language, artist and text filters, plus pagination
- Home page with mood cards, Browse page (filters and pages), Search page
- Protected routes (Liked Songs and Playlists need login)
- Music player: play/pause, next/previous, queue, keeps playing while you navigate (YouTube embedded player)

In progress:
- Player progress bar, seek and volume
- Liked songs, playlists, profile

## Prerequisites

- Node.js 18 or newer (`node --version`)
- MongoDB Community Server running locally on port 27017
- Git

## Setup

Run these in two separate terminals.

### 1. Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Open `backend/.env` and replace `JWT_SECRET` with your own long random string. Generate one with:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Never commit `.env` and never share the secret.

Load the songs into your local database, then start the server:

```powershell
npm run seed
npm run dev
```

You should see `MongoDB connected` and `Server running on http://localhost:5000`.

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Environment variables (`backend/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Backend port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend address allowed by CORS |
| `MONGODB_URI` | Local MongoDB address (use `127.0.0.1`, not `localhost`) |
| `JWT_SECRET` | Secret used to sign login tokens |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d` |

## Project structure

```
Vibify_FB/
  backend/
    src/
      config/       database connection
      models/       Mongoose models (Song, User)
      controllers/  request handling
      routes/       URL to controller mapping
      services/     database logic
      middleware/   auth guard, error handler
      validators/   input checks
      scripts/      seed and video-check scripts
      data/         songs.json (verified playable songs)
  frontend/
    src/
      components/   reusable UI
      pages/        Home, Browse, Search, Login, Register...
      features/     Redux slices (auth)
      services/     API calls
      utils/        helpers
```

## API summary

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Log in |
| POST | `/api/auth/logout` | No | Log out |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/songs` | No | List songs (`mood`, `language`, `artist`, `q`, `page`, `limit`) |
| GET | `/api/songs/facets` | No | Moods, languages, artists with counts |
| GET | `/api/songs/:id` | No | One song |

## Song data

`backend/src/data/songs.json` holds only songs whose YouTube videos were verified to exist. Songs that failed the check are listed in `songs.broken.json` and need a correct video id before they can be added back. To re-check the list:

```powershell
cd backend
npm run check:videos
```

## Working together

- Never commit `.env`.
- Work on your own branch (for example `feature/liked-songs`), not directly on `master`.
- Run `git pull` before you start working.