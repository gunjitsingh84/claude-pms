# Supabase setup

This directory will hold SQL migrations and Supabase configuration as database work begins.

Before connecting production data:
1. Create or select the Supabase project.
2. Configure local `.env.local` with the project URL and publishable key.
3. Add reviewed SQL migrations under `migrations/`.
4. Enable RLS on every exposed application table.
5. Add workspace-membership-aware policies and test allowed and denied access.
6. Keep service-role/secret keys out of frontend code and Git.

No schema has been deployed yet. See `../docs/ARCHITECTURE.md` for the proposed model.
