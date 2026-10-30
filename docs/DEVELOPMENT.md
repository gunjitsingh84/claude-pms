# Development Guide

## Requirements

- Node.js LTS and npm.
- A Supabase project for authenticated, persistent data features.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Populate `.env.local` with the Supabase project URL and publishable key before testing authentication or database access.

## Quality checks

```bash
npm run lint
npm run build
```

## Deployment

Import the repository into Vercel and configure the same two frontend environment variables in each deployment environment. Deploy previews should use a non-production Supabase project when possible.

## Security

- Never commit `.env.local`.
- Never use a service-role or secret key in any `VITE_*` variable.
- Keep RLS enabled and test policies using authenticated users with different workspace roles.
- Treat demo dashboard figures as placeholder content until data-backed feature work replaces them.
