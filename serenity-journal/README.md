# 🌸 Serenity Journal

A calming daily journal for emotional wellbeing — write, track your moods,
breathe, meditate, and reflect, wrapped in a soft, Japanese-inspired interface.

Built entirely with **free and open-source technology**. No paid APIs, no
paid services, no credit card required to run it locally.

---

## ✨ What's included

- **Auth** — register / login / logout with JWT + bcrypt, and a local
  "forgot password" flow (security question, no email service needed)
- **Journal** — create/edit/delete entries, autosave, word & character count,
  mood + emotion tags, favorites, pinning, archive, search & filter
- **Calendar** — month view, color-coded by mood, click a day to see entries
- **Mood analytics** — weekly/monthly/yearly distribution, most common mood,
  streaks, powered by Chart.js
- **Breathing exercise** — animated circle, 4-4-4 and 4-7-8 patterns, 5-minute timer
- **Meditation timer** — 5/10/15/20/30 minutes with a soft bell on completion
- **Daily goals (to-do list)** and **Gratitude journal** (3 things a day)
- **Quote of the day** — tries the free [ZenQuotes](https://zenquotes.io) API,
  falls back to a local JSON list if it's unreachable (no key required either way)
- **Personalization** — 9 themes (Sakura, Ocean, Forest, Sunset, Midnight,
  Cloud, Nature, Lavender, Daisy), light/dark/auto mode, 10 fonts, adjustable
  font size & card transparency, animated backgrounds (petals, rain, snow,
  stars, waves, aurora, blobs), all saved per-user
- **Ambient "music" player** — play/pause/next/prev/volume/mute, with tracks
  (rain, ocean, forest, fireplace, wind, piano pad, meditation tone, night)
  **generated locally in the browser with the Web Audio API** — see the note
  below on why, and how to swap in real audio files if you'd prefer

## 🧱 Tech stack

| Layer     | Choice                                              |
|-----------|------------------------------------------------------|
| Frontend  | React + Vite, Tailwind CSS, Framer Motion, React Router, React Icons, Chart.js |
| Backend   | Node.js + Express                                    |
| Database  | MongoDB (local or MongoDB Atlas free tier)           |
| Auth      | JWT + bcrypt                                         |
| State     | React Context API                                    |
| HTTP      | Axios                                                |

---

## 📁 Folder structure

```
serenity-journal/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/      # route handlers
│   ├── models/            # Mongoose schemas (User, Journal, Settings, Todo, Gratitude)
│   ├── routes/
│   ├── middleware/        # JWT auth guard, error handling
│   ├── utils/              # token + streak helpers
│   ├── data/                # local quotes.json / affirmations.json
│   └── server.js
└── frontend/
    └── src/
        ├── components/    # Sidebar, MoodPicker, MusicPlayer, AnimatedBackground, etc.
        ├── pages/           # Dashboard, Journal, Calendar, Analytics, Breathing, ...
        ├── context/          # AuthContext, SettingsContext
        ├── data/              # mood definitions
        └── utils/              # axios instance, sound engine
```

---

## 🚀 Getting started

### 1. Prerequisites

- [Node.js](https://nodejs.org) 18+
- MongoDB — either:
  - **Local**: install MongoDB Community Server and run it (`mongod`), or
  - **Free cloud**: create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (M0 tier, no cost)

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/serenity-journal   # or your Atlas connection string
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

Run it:

```bash
npm run dev       # nodemon, auto-restarts on changes
# or
npm start
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open `http://localhost:5173`.

That's it — register an account and start journaling. No paid services, no
API keys required for anything to function.

---

## 🎧 A note on the music player

The brief asked for royalty-free music with no paid APIs. Rather than bundle
third-party audio files of uncertain licensing, the music player **generates
its ambient tracks locally in the browser** using the Web Audio API (filtered
noise for rain/ocean/wind, a soft oscillator pad for the piano/meditation
tracks, etc.) — see `frontend/src/utils/soundEngine.js`. It's fully
functional (play/pause/next/prev/volume/mute) and needs no internet
connection or licensing at all.

If you'd rather use real recorded audio, drop your own royalty-free `.mp3`
files (e.g. from [Free Music Archive](https://freemusicarchive.org) or
[Pixabay Audio](https://pixabay.com/music/), checking each track's license)
into `frontend/public/audio/`, and swap `MusicPlayer.jsx` to use an
`<audio>` element pointed at those files instead of `soundEngine.js`.

## 🌤️ A note on weather (optional/bonus)

The brief mentions the free, keyless [Open-Meteo](https://open-meteo.com) API
as an optional feature. It isn't wired into the UI in this build — add a
small component that calls `https://api.open-meteo.com/v1/forecast` with a
lat/lon (no key needed) if you'd like to include it on the dashboard.

## 🧩 Features from the brief not included in this build

To keep the delivered code focused and genuinely working end-to-end, a
handful of "bonus" items from the spec were left out and are good next
projects: PDF/Markdown export, voice journaling (speech-to-text /
text-to-speech), photo memories, habit/sleep/water trackers, and a Pomodoro
timer. The architecture (Mongoose models + Express routes + React
pages/context) is set up so each of these can be added as one more model +
controller + route + page, following the same pattern as `Todo`/`Gratitude`.

---

## ☁️ Deployment (all free tiers)

**Backend → Render**
1. Push this repo to GitHub.
2. On [Render](https://render.com), create a new **Web Service** from the repo, root directory `backend`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`) in the Render dashboard.

**Frontend → Vercel**
1. On [Vercel](https://vercel.com), import the repo, root directory `frontend`.
2. Framework preset: Vite.
3. Add environment variable `VITE_API_URL` pointing to your deployed Render backend, e.g. `https://your-app.onrender.com/api`.
4. Deploy.

**Database → MongoDB Atlas free tier (M0)**
1. Create a free cluster at MongoDB Atlas.
2. Add your Render backend's IP (or `0.0.0.0/0` for simplicity) to the Atlas Network Access list.
3. Use the provided connection string as `MONGO_URI`.

---

## 🔒 Security notes

- Passwords are hashed with bcrypt before storage; the "forgot password"
  security answer is hashed the same way.
- All journal/todo/gratitude/settings routes require a valid JWT.
- Basic request validation and centralized error handling are in place;
  harden further (rate limiting, stricter input validation) before any
  public/production deployment.

Enjoy the quiet. 🕊️
