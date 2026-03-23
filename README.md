## Feedback Form (Next.js + Supabase)

This project implements a production-ready feedback form using:

- Next.js App Router
- Server Actions (`"use server"`)
- Supabase JavaScript client
- Tailwind CSS UI

## 1) Environment variables

Copy `.env.example` to `.env.local` and set real values:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 2) Create the `feedbacks` table in Supabase

Run this SQL in the Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  rating int not null check (rating between 1 and 5),
  feedback text not null,
  created_at timestamptz not null default now()
);
```

## 3) Run locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/page.tsx`: page entry, renders form component.
- `components/feedback-form.tsx`: form UI, pending state with `useFormStatus`, and status messages.
- `app/actions/feedback.ts`: server action validation and Supabase insert logic (only exports async functions; required by Next.js `"use server"` files).
- `lib/feedback-action-types.ts`: shared action state type and initial state for `useActionState`.
- `lib/supabase.ts`: centralized Supabase client setup from environment variables.

## Validation rules

- `name` is required.
- `feedback` is required.
- `email` is optional but validated when provided.
- `rating` must be an integer from 1 to 5.

## Notes for production

- Configure Row Level Security (RLS) policies in Supabase to allow inserts for your intended users/clients.
- Monitor server logs for failed inserts (error details are logged in the server action).
