# Plainrank

An open-source, sponsor-free app/SaaS review site focused on maximum transparency.  
No paid placements. No hidden rankings. Every scoring algorithm is publicly auditable.

**Live:** https://plainrank.vercel.app

---

## Features

- Sponsor-free reviews — no paid placements or affiliate-driven rankings
- Transparent scoring — the algorithm lives in `src/lib/score.ts`, open for anyone to audit
- OAuth login via GitHub and Google (Auth.js v5)
- Moderation workflow — submitted reviews go through admin approval before publication

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma 7 |
| Database | PostgreSQL via Neon |
| Auth | Auth.js (NextAuth v5) |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) (or compatible PostgreSQL) database
- GitHub OAuth App and/or Google OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/your-username/plainrank.git
cd plainrank
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in each value. See [Environment Variables](#environment-variables) below for details.

### 4. Run database migrations

```bash
npx prisma migrate dev
```

Optionally seed initial data:

```bash
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy `.env.example` to `.env.local` and set the following values.

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Random secret for Auth.js. Generate with `npx auth secret` |
| `AUTH_GITHUB_ID` | Client ID of your GitHub OAuth App |
| `AUTH_GITHUB_SECRET` | Client Secret of your GitHub OAuth App |
| `AUTH_GOOGLE_ID` | Client ID of your Google OAuth credential |
| `AUTH_GOOGLE_SECRET` | Client Secret of your Google OAuth credential |
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://...`) |
| `ADMIN_EMAIL` | Email address granted admin access for review moderation |

> **Security note:** Never commit `.env.local` to version control. It is already listed in `.gitignore`.

---

## Project Structure

```
src/
├── app/
│   ├── (public)/       # Pages accessible without login
│   ├── (auth)/         # Login / OAuth callback
│   ├── (dashboard)/    # Logged-in pages (review submission, etc.)
│   └── admin/          # Admin-only moderation pages
├── auth.ts             # Auth.js configuration (GitHub + Google)
├── components/
│   ├── ui/             # shadcn/ui base components (do not edit directly)
│   ├── review/         # Review-related components
│   ├── service/        # Service-related components
│   └── layout/         # Header, footer, etc.
└── lib/
    ├── prisma.ts       # Prisma client singleton
    ├── score.ts        # Scoring algorithm (core of Plainrank — see comments)
    └── validations/    # Zod schemas for input validation

prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Initial seed data
```

---

## Contributing

Contributions are welcome. Please open an issue before submitting a large pull request so we can discuss the approach.

- Keep `src/lib/score.ts` changes minimal and well-commented — this is the heart of the project's transparency promise.
- Run `npm run lint` before submitting a PR.
- Do not use `any` types; use `unknown` with type guards instead.

---

## License

[MIT](./LICENSE)
