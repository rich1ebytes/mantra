# Mantra — Backend API

A personalized multi-origin news platform with AI-powered chat assistant.

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **AI Chatbot:** Google Gemini (free tier)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime
- **Storage:** Supabase Storage

## Quick Start

### 1. Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free)
- A [Google AI Studio](https://aistudio.google.com) API key (free)

### 2. Install
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Fill in your Supabase and Gemini credentials
```

### 4. Database Setup
```bash
npx prisma db push      # Push schema to Supabase
npx prisma generate      # Generate Prisma client
node prisma/seed.js      # Seed origins & categories
```

### 5. Run
```bash
npm run dev              # Development (with hot reload)
npm start                # Production
```

Server starts at `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ✗ | Register |
| POST | /api/auth/login | ✗ | Login |
| POST | /api/auth/logout | ✗ | Logout |
| POST | /api/auth/refresh | ✗ | Refresh token |
| GET | /api/users/me | ✓ | Current user |
| PATCH | /api/users/me | ✓ | Update profile |
| PUT | /api/users/me/preferences | ✓ | Set preferences |
| GET | /api/articles | ✗ | List articles |
| GET | /api/articles/trending | ✗ | Trending articles |
| GET | /api/articles/search?q= | ✗ | Search articles |
| GET | /api/articles/:slug | ✗ | Single article |
| POST | /api/articles | ✓ | Create article |
| PATCH | /api/articles/:id | ✓ | Update article |
| DELETE | /api/articles/:id | ✓ | Delete article |
| GET | /api/origins | ✗ | List origins |
| GET | /api/categories | ✗ | List categories |
| GET | /api/bookmarks | ✓ | User bookmarks |
| POST | /api/bookmarks/:articleId | ✓ | Add bookmark |
| DELETE | /api/bookmarks/:articleId | ✓ | Remove bookmark |
| POST | /api/chat/sessions | ✓ | New chat session |
| GET | /api/chat/sessions | ✓ | List sessions |
| POST | /api/chat/messages | ✓ | Send message |
| POST | /api/chat/messages/stream | ✓ | Stream message (SSE) |
| POST | /api/chat/briefing | ✓ | Daily briefing |
| POST | /api/chat/summarize/:id | ✓ | Summarize article |

## Project Structure

```
src/
├── index.js                  # Express app entry point
├── config/                   # Supabase, Gemini, CORS, env
├── routes/                   # Route definitions
├── controllers/              # Request handlers
├── services/                 # Business logic
├── middleware/                # Auth, validation, rate limiting
├── validators/               # Zod schemas
└── utils/                    # Helpers, prompts, constants
```

