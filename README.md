# Job Tracker

A full-stack job application tracker built for a fresher's real job hunt. Track applications through a status pipeline, manage companies, get reminders, and measure your search with a stats dashboard. AI features (resume-JD match score, scam/red-flag checker) are planned next.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB with Mongoose
- **Auth:** JWT in an httpOnly cookie (register/login/logout), bcrypt password hashing
- **Security:** helmet, rate-limited auth routes, strict CORS, Zod input validation

## Project Structure

```
job-tracker-2026/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/            # API client + endpoint modules
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       └── lib/            # Helpers, constants, types
└── server/                 # Express + TypeScript API
    └── src/
        ├── config/         # Env + database setup
        ├── controllers/    # Route handlers
        ├── middleware/     # Auth, validation, error handling
        ├── models/         # Mongoose models
        ├── routes/         # Express routers
        ├── utils/          # ApiError, JWT helpers
        └── validators/     # Zod schemas
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or Atlas)

### Backend

```bash
cd server
cp .env.example .env        # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev                 # starts on http://localhost:5000
```

### Frontend

```bash
cd client
cp .env.example .env        # default VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # starts on http://localhost:5173
```

## API Overview

| Method | Endpoint                | Description                    | Auth |
|--------|-------------------------|--------------------------------|------|
| POST   | /api/auth/register      | Create account                 | No   |
| POST   | /api/auth/login         | Log in, sets session cookie    | No   |
| POST   | /api/auth/logout        | Clear session                  | No   |
| GET    | /api/auth/me            | Current user                   | Yes  |
| GET    | /api/applications       | List applications (filterable) | Yes  |
| POST   | /api/applications       | Create application             | Yes  |
| GET    | /api/applications/:id   | Get one application            | Yes  |
| PATCH  | /api/applications/:id   | Update application/status      | Yes  |
| DELETE | /api/applications/:id   | Delete application             | Yes  |
| GET    | /api/health             | Health check                   | No   |

## Roadmap

- [ ] Company records linked to applications
- [ ] Status pipeline: saved → applied → interview → offer/rejected
- [ ] Reminders (cron) + email notifications
- [ ] Resume version uploads
- [ ] Stats dashboard (response rate, funnel)
- [ ] AI: resume vs JD match score
- [ ] AI: scam / red-flag checker for job posts

## License

MIT
