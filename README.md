# GATE CS Progress Tracker

A personal, modern dashboard to track your GATE Computer Science mock test performance.

## Features
- 📊 Dashboard with key statistics (total tests, latest score, highest, average, improvement/decline)
- ➕ Add mock tests with name, date, marks, max marks, GATE score, rank, remarks
- 📈 Interactive area chart (percentage or raw marks) with per-point improvement overlay
- 📉 Separate GATE Score chart
- 📋 Full test history table with sort, edit, delete
- 💾 Auto-saves to localStorage — data persists across refreshes
- 📤 Export to CSV / JSON
- 📥 Import from CSV / JSON
- 🌙 Dark / Light mode toggle
- 📱 Fully responsive (mobile sidebar)

## Stack
- React + Vite
- Recharts
- lucide-react
- localStorage (no backend needed)

## Getting Started

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. Import it on [vercel.com](https://vercel.com).
3. Framework preset: **Vite**.
4. Done — zero config needed.

## Deploy on Replit

1. Create a new Replit → "Import from GitHub".
2. Run command: `npm install && npm run dev -- --host 0.0.0.0`
