# Initial Architecture

## Product

Gunjit Project Management System (GPMS) is a multi-workspace project management web application.

## Technology

- React + TypeScript for UI and domain components.
- Vite for development and production builds.
- Tailwind CSS plus a small global stylesheet for design-system primitives and responsive layout.
- Supabase Postgres for persistent data, Supabase Auth for identity, and Storage for project files.
- Vercel as the initial frontend deployment target.

## Proposed application layers

```
React UI / routes
  ├─ Feature modules (workspace, projects, tasks, requirements, team, reports)
  ├─ Shared UI components and design tokens
  ├─ Domain types and validation
  └─ Data-access layer
       └─ Supabase client (publishable key only in browser)
            ├─ Postgres + RLS
            ├─ Auth
            └─ Storage
```

## Proposed feature layout

- `src/app/` — application composition and route configuration.
- `src/components/` — reusable components and layout.
- `src/features/workspaces/` — workspace switcher, members, settings.
- `src/features/projects/` — project list, details, statuses, milestones.
- `src/features/tasks/` — task list, board, assignment, priority and due dates.
- `src/features/requirements/` — requirements, acceptance criteria, traceability.
- `src/features/team/` — members and role-aware screens.
- `src/lib/` — Supabase client and shared utilities.
- `src/types/` — shared TypeScript domain types.
- `supabase/migrations/` — reviewed, version-controlled SQL migrations.

Feature folders will be introduced as the corresponding milestones are implemented; the initial dashboard remains intentionally compact.

## Security principles

1. Never ship a Supabase service-role or secret key to the browser.
2. Enable RLS for every exposed table.
3. Enforce workspace membership and role permissions in database policies, not only by hiding UI.
4. Keep authorization claims out of user-editable profile metadata.
5. Validate all writes and handle Supabase errors explicitly.
6. Do not add production credentials or personal data to the repository.

## Initial data model (planned)

- `profiles`: application profile linked to `auth.users`.
- `workspaces`: organization/team boundary and owner.
- `workspace_members`: membership and role per workspace.
- `projects`: workspace-scoped projects with owner, status and dates.
- `project_members`: project-level access where needed.
- `tasks`: project-scoped work items with assignee, priority, status and due date.
- `requirements`: structured requirements linked to projects and tasks.
- `activity_events`: workspace-scoped audit/activity feed.

This model is a proposal, not yet deployed. The SQL migration and RLS policy set must be reviewed before connecting real users.

## Configuration

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in a local `.env.local` or deployment environment. Without them, the interface runs in demo mode and must not imply data is persisted.
