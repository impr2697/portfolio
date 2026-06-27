<<<<<<< HEAD
# Portfolio — Vercel Deployment Guide

A Next.js 14 portfolio site with a hidden `/login` admin panel, backed by **Vercel KV** (Redis) for persistent storage of projects and a hashed password.
=======
# Portfolio — Free Deployment Guide

**100% free stack, no credit card required:**
- **Vercel Hobby** — free forever, deploys Next.js in seconds
- **Upstash Redis** — free tier: 500K commands/month, 256MB storage, no card needed
>>>>>>> 72cf128 (init portfoliol)

---

## Project structure

```
portfolio/
├── app/
│   ├── page.tsx              ← Public portfolio (/)
<<<<<<< HEAD
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
=======
│   ├── ProjectGrid.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   ├── page.tsx          ← /login
│   │   └── LoginClient.tsx
│   ├── admin/
│   │   ├── page.tsx          ← /admin (auth-guarded)
│   │   └── AdminClient.tsx
│   └── api/
│       ├── auth/route.ts
│       ├── projects/route.ts
│       └── password/route.ts
├── lib/
│   ├── kv.ts                 ← Upstash Redis client
│   ├── session.ts            ← HMAC-signed httpOnly cookie
│   └── hash.ts               ← SHA-256
├── .env.local                ← never commit this
>>>>>>> 72cf128 (init portfoliol)
└── package.json
```

---

<<<<<<< HEAD
## Deploy to Vercel (step-by-step)

### 1. Push to GitHub
=======
## Deploy steps

### Step 1 — Prepare locally

```bash
cd portfolio
npm install
```

### Step 2 — Push to GitHub

Create a new repo at github.com/new (no README), then:
>>>>>>> 72cf128 (init portfoliol)

```bash
git init
git add .
git commit -m "init portfolio"
<<<<<<< HEAD
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
=======
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### Step 3 — Create a free Upstash Redis database

1. Go to **console.upstash.com** → sign up free (no credit card)
2. Click **Create Database**
3. Name it `portfolio`, pick a region close to you, click **Create**
4. On the database page, scroll to **REST API** section
5. Copy the two values shown:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

Keep these handy for step 5.

### Step 4 — Import on Vercel

1. Go to **vercel.com** → sign up free with your GitHub account
2. Click **Add New… → Project**
3. Import your `portfolio` repo
4. Leave all settings as default — **don't change anything**
5. Click **Deploy** (first deploy will fail or warn — that's fine, env vars aren't set yet)

### Step 5 — Add environment variables on Vercel

In your Vercel project → **Settings** → **Environment Variables**, add these three:

| Name | Value |
|---|---|
| `UPSTASH_REDIS_REST_URL` | the URL you copied from Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | the token you copied from Upstash |
| `SESSION_SECRET` | run `openssl rand -hex 32` and paste the output |

Tick **Production**, **Preview**, and **Development** for each, then click **Save**.

### Step 6 — Redeploy

In your Vercel project → **Deployments** → click **⋯** on the latest → **Redeploy**.

Wait ~60 seconds for the green **Ready** badge.

### Step 7 — Set your admin password

Visit `https://your-project.vercel.app/login`

You'll see a **Set your password** screen on first visit. Set a strong password — it's stored as a SHA-256 hash in Upstash, never as plaintext. You'll land on `/admin` and can start adding projects immediately.
>>>>>>> 72cf128 (init portfoliol)

---

## Local development

<<<<<<< HEAD
```bash
npm install

# Pull env vars from Vercel (requires Vercel CLI)
npx vercel link
npx vercel env pull .env.local

=======
Paste your Upstash credentials into `.env.local`:

```
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
SESSION_SECRET=any_long_random_string_for_local
```

Then run:

```bash
>>>>>>> 72cf128 (init portfoliol)
npm run dev
# → http://localhost:3000
# → http://localhost:3000/login
# → http://localhost:3000/admin
```

<<<<<<< HEAD
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
=======
---

## Free tier limits (more than enough for a portfolio)

| Service | Free limit |
|---|---|
| Vercel Hobby | Unlimited deploys, 100GB bandwidth/month |
| Upstash Redis | 500,000 commands/month, 256MB storage |

A portfolio with 20 projects doing 1000 visits/day uses roughly 3,000 Redis commands/day (~90,000/month) — well within the free tier.

---

## Security

| Feature | How |
|---|---|
| Password | SHA-256 hashed, stored in Upstash — plaintext never saved |
| Session | HMAC-signed `httpOnly; Secure; SameSite=Lax` cookie, 4hr TTL |
| Admin API | All write routes verify session server-side |
| Admin URL | `/login` — no links to it from the public site |
>>>>>>> 72cf128 (init portfoliol)
