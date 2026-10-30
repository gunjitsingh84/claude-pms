# Gunjit Project Management System

A modern project management system built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Product direction

- **Product:** Gunjit Project Management System (GPMS)
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage; Realtime where useful)
- **Quality:** ESLint, TypeScript strict mode, automated checks
- **Deployment target:** Vercel-ready static frontend

## Getting started

1. Install Node.js (current LTS) and npm.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and publishable key.
4. Start the development server: `npm run dev`

Never put a Supabase service-role/secret key in frontend environment variables. Only the project URL and publishable key belong in the browser app.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the initial architecture and [docs/ROADMAP.md](docs/ROADMAP.md) for planned milestones.

## Database

Supabase migrations will live in `supabase/migrations/`. Row Level Security (RLS) must be enabled for every exposed application table, with policies matching workspace membership and role. Do not connect the frontend to production data until the schema and policies have been reviewed.

## Current status

**Foundation phase — v0.1.0.** This commit establishes product direction and repository structure. Supabase credentials/project have not yet been configured, and the first UI feature is not yet implemented.
