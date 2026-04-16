# CodeCoach

A full-stack application for practicing coding problems and tracking performance over time, with AI-powered feedback on submissions.

## About

CodeCoach lets users browse coding problems, submit solutions, and get meaningful feedback on their work. Every attempt is saved with metadata, time spent, success status, and problem category, so the app can surface weak areas and show performance trends on a personal dashboard. An integrated AI tutor analyzes submissions and provides feedback on things like time complexity and coding style.

## Features

- **OAuth Login** — Sign in with Google or GitHub
- **Problem Browser** — Browse, search, and filter coding problems by category
- **Solution Submissions** — Submit code and track each attempt with detailed metadata
- **Submission History** — Review past attempts with per-submission detail views
- **AI Tutor** — Get automated feedback on time complexity, coding style, and approach
- **Analytics Dashboard** — Visualize performance trends, track progress, and identify weak areas

## Tech Stack

**Frontend:** React Native (mobile, web) with a consistent UI across both

**Backend:** Spring Boot (Java)

**Database:** Supabase PostgreSQL

**Infrastructure:** Docker, Render, GitHub Actions CI/CD

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/problems` | Browse all problems |
| GET | `/problems/{id}` | Get a specific problem |
| GET | `/problems/search` | Search and filter problems |
| POST | `/submissions` | Submit a solution |
| GET | `/submissions/{id}` | Get a specific submission |
| GET | `/users/{id}/submissions` | Get submission history |
| GET | `/users/{id}/weaknesses` | See weak categories |
| GET | `/users/{id}/analytics` | Performance stats |
| POST | `/submissions/{id}/feedback` | Request AI feedback |
| PUT | `/users/{id}/profile` | Update profile |
| DELETE | `/users/{id}/account` | Delete account |

## Team Slices

The project is divided into four vertical slices, each covering a full feature from database to UI:

1. **Auth & User Profiles** — OAuth2 login (Google + GitHub), profile management, account settings
2. **Problems & Search** — Problem browsing, detail views, search and filter UI
3. **Submissions & History** — Code submission form, submission history, individual attempt details
4. **AI Tutor & Analytics Dashboard** — AI feedback on submissions, performance charts, weakness breakdown

## Database Schema

- `users` — User accounts and auth info
- `user_settings` — Per-user preferences
- `problems` — Coding problem definitions
- `problem_categories` — Category tags for problems
- `submissions` — Solution attempts with metadata (time spent, status, category)
- `feedback` — AI-generated feedback tied to submissions
- `analytics` — Computed performance views

## Testing

- **Frontend:** Jest (unit tests), Playwright (E2E)
- **Backend:** JUnit (Spring Boot), Postman (route testing)
- **CI/CD:** GitHub Actions runs tests on push; branch protection requires passing tests before merging to main

## Team

- Mauricio Reynoso
- Paulo Camacho
- Maximilian Marshall
- Omar Martinez-Fuentes

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Docker

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## License

This project was built for CST 438 — Software Engineering.
