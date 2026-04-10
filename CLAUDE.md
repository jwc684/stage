# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js 16 + Turbopack)
npm run build        # prisma generate && next build
npm run lint         # eslint
npx tsc --noEmit     # Type-check without emitting

# Database
npx prisma migrate dev --name <name>   # Create and apply migration locally
npx prisma migrate deploy              # Apply migrations to remote DB
npx prisma generate                    # Regenerate Prisma client (output: src/generated/prisma/)
```

## Environment Variables

Required in `.env` (never committed — in .gitignore):
- `DATABASE_URL` — PostgreSQL connection string (Supabase Session Pooler)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
- `ANTHROPIC_API_KEY` — Claude API key for 도슨트 AI chatting (server-side only)
- `VOYAGE_API_KEY` — Voyage AI API key for blog content embedding/RAG (server-side only)

## Architecture

**STAGE** is a Korean-language digital magazine + blog platform. All UI text is in Korean.

### Stack
- **Next.js 16** (App Router, Server Components, Server Actions, Turbopack)
- **Prisma 7** with `@prisma/adapter-pg` (PostgreSQL via Supabase)
- **Supabase Storage** for file uploads (bucket: `stage_storage`)
- **Tiptap** rich text editor for blog content
- **Tailwind CSS 4** + shadcn/ui components
- **Deployed on Vercel** — all DB-querying pages use `export const dynamic = "force-dynamic"`

### Data Flow

```
Server Actions (src/actions/)  →  Prisma  →  Supabase PostgreSQL
File Uploads (API routes)      →  Supabase Storage (via src/lib/upload.ts)
```

- `src/lib/prisma.ts` — Singleton Prisma client with PrismaPg adapter
- `src/lib/supabase.ts` — Lazy-initialized Supabase client (must be lazy to avoid build-time errors on Vercel)
- `src/lib/upload.ts` — File upload/delete via Supabase Storage; validates MIME types from `src/lib/constants.ts`

### Two Content Types

**Magazines**: Multi-page image-based publications. Admin uploads page images, reorders via drag-and-drop. Public viewer uses react-pageflip for book-like reading.

**Blog Posts**: Rich text articles with Tiptap editor. Supports image upload (dialog, drag-and-drop, clipboard paste), tags, custom publish dates, slug-based URLs.

### Server Actions Pattern

All server actions in `src/actions/` follow the same pattern:
- Zod validation with Korean error messages (`zod/v4`)
- Return `{ error: string }` on failure, `{ success: true }` on success
- `redirect()` after create/delete
- `revalidatePath()` for affected routes

### Key Conventions

- **Korean UI** — All user-facing text, labels, toasts, and error messages are in Korean
- **StatusBadge** accepts `string` (not a specific enum type) to be shared between Magazine and BlogPost statuses
- **Blog content sanitization** — `sanitize-html` is used server-side before rendering with `dangerouslySetInnerHTML`
- **Prisma client** is generated to `src/generated/prisma/` (in .gitignore; generated at build time via `postinstall`)
- **`export const dynamic = "force-dynamic"`** is required on every page that queries the database (Supabase IPv6 incompatible with Vercel build servers)
