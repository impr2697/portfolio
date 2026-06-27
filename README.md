# Portfolio — Free Deployment Guide

**100% free stack, no credit card required:**
- **Vercel Hobby** — free forever, deploys Next.js in seconds
- **Upstash Redis** — free tier: 500K commands/month, 256MB storage, no card needed

---

## Project structure

```
portfolio/
├── app/
│   ├── page.tsx              ← Public portfolio (/)
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
└── package.json
```

---

## Deploy steps

### Step 1 — Prepare locally

```bash
cd portfolio
npm install
```

### Step 2 — Push to GitHub

Create a new repo at github.com/new (no README), then:

```bash
git init
git add .
git commit -m "init portfolio"
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

---

## Local development

Paste your Upstash credentials into `.env.local`:

```
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
SESSION_SECRET=any_long_random_string_for_local
```

Then run:

```bash
npm run dev
# → http://localhost:3000
# → http://localhost:3000/login
# → http://localhost:3000/admin
```

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
