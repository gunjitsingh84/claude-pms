# Roadmap

## v0.1.0 — Foundation (current)

- [x] Initialize React + TypeScript + Vite.
- [x] Add responsive application shell and dashboard concept.
- [x] Add Supabase client bootstrap and safe environment template.
- [x] Document architecture, roadmap and security boundaries.
- [ ] Install dependencies and verify a production build in a local development environment.
- [ ] Connect a Supabase project and verify auth/configuration.

## v0.2.0 — Identity and workspaces

- Authentication screens and session lifecycle.
- Profile creation and workspace onboarding.
- Workspace membership and roles.
- Initial Postgres migration with RLS policies and tests.

## v0.3.0 — Projects

- Create, edit, archive and list projects.
- Project ownership, members, status and dates.
- Project overview and project detail routes.

## v0.4.0 — Tasks and workflows

- Tasks, priorities, assignees, due dates and status.
- List and Kanban views.
- Filters, search and task detail panel.

## v0.5.0 — Requirements and traceability

- Requirements records and acceptance criteria.
- Link requirements to projects and tasks.
- Change history and traceability.

## v0.6.0 — Collaboration

- Team directory and invitations.
- Activity feed and notifications.
- Attachments using private Supabase Storage buckets and policies.

## v0.7.0 — Reporting

- Project health, overdue work, capacity and delivery summaries.
- Date filters and export-ready reports.

## v1.0.0 — Production readiness

- Authorization/RLS review and automated tests.
- Accessibility and responsive QA.
- Error monitoring, deployment environments and operational documentation.

## Working agreement

- Deliver one milestone at a time.
- Keep configuration and secrets out of Git.
- Make schema changes via reviewed SQL migrations.
- Do not claim a feature is complete until it has been verified.
