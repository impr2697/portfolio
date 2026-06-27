# Portfolio — Vercel Deployment Guide

A Next.js 14 portfolio site with a hidden `/login` admin panel, backed by **Vercel KV** (Redis) for persistent storage of projects and a hashed password.

---

## Project structure

```
portfolio/
├── app/
│   ├── page.tsx              ← Public portfolio (/)
│   ├── ProjectGrid.tsx       ← Client component for card hover glow
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   ├── page.tsx          ← /login  (server — auth check)
│   │   └── LoginClient.tsx   ← Login / first-run setup form
│   ├── admin/
│   │   ├── page.tsx          ← /admin  (server — auth guard)
│   │   └── AdminClient.tsx   ← Dashboard UI
│   └── api/
│       ├── auth/route.ts     ← POST /api/auth  (login, logout, setup)
│       ├── projects/route.ts ← GET/POST/DELETE /api/projects
│       └── password/route.ts ← POST /api/password
├── lib/
│   ├── kv.ts                 ← Vercel KV helpers
│   ├── session.ts            ← HMAC-signed httpOnly cookie session
│   └── hash.ts               ← SHA-256 helper
├── .env.local                ← Local secrets (never commit)
├── vercel.json
└── package.json
```

---

## Deploy to Vercel (step-by-step)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "init portfolio"
gh repo create portfolio --public --push   # or push to an existing repo
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework preset will auto-detect **Next.js** → click **Deploy**

### 3. Create a Vercel KV database

1. In your Vercel project → **Storage** tab → **Create Database** → choose **KV**
2. Name it (e.g. `portfolio-kv`) → **Create & Continue**
3. Click **Connect to Project** → select your portfolio project → **Connect**
4. Vercel automatically adds the `KV_*` environment variables to your project

### 4. Add SESSION_SECRET

1. In your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `SESSION_SECRET`
   - **Value:** any long random string (run `openssl rand -hex 32` in your terminal)
   - **Environment:** Production, Preview, Development

### 5. Redeploy

After adding the environment variables, go to **Deployments** → click the three-dot menu on the latest deployment → **Redeploy**.

### 6. First login

Visit `https://your-domain.vercel.app/login` — you'll see a **Set your password** screen on the first visit. After setting it, you'll be taken straight to the admin dashboard.

---

## Local development

```bash
npm install

# Pull env vars from Vercel (requires Vercel CLI)
npx vercel link
npx vercel env pull .env.local

npm run dev
# → http://localhost:3000
# → http://localhost:3000/login
# → http://localhost:3000/admin
```

If you don't have a KV instance yet locally, you can temporarily stub it out or use [Upstash Redis](https://upstash.com) with the same env var names.

---

## Security notes

| Feature | Implementation |
|---|---|
| Password storage | SHA-256 hash in Vercel KV — plaintext never stored |
| Session | HMAC-signed value in `httpOnly; Secure; SameSite=Lax` cookie, 4-hour TTL |
| API auth | All mutating API routes check session server-side before acting |
| Admin URL | `/login` — no links to it anywhere on the public site |

> **Tip:** For stronger password security, consider upgrading from SHA-256 to bcrypt via the `bcryptjs` package and a short API route.
