# 🪙 CoinJar — Personal Finance Tracker

> A modern, minimalist personal finance tracker that gives you a clear view of your money — income, expenses, and balance — without the clutter of traditional accounting tools.

**🔗 Live demo:** [https://purl.pl/coinjar]
**💻 Deployed on:** Google Cloud Run

<!-- Add a screenshot of the app (the glassmorphism dark UI looks great): -->
<!-- ![CoinJar screenshot](docs/screenshot.png) -->

---

## 💡 Overview

Most budgeting apps are overloaded with tables, reports, and settings most people never touch. **CoinJar** takes the opposite approach: a clean, mobile-first interface focused on one thing — helping you instantly see where your money goes. It's designed for people who value simplicity and good design over heavy, spreadsheet-like finance systems.

## ✨ Features

- **Secure Google Sign-In** — authentication via Firebase Auth, so there's no extra password to remember and user data stays protected.
- **Dashboard** — a visual summary of total balance, income, and expenses, with smooth navigation between months and years.
- **Transaction management** — quickly add income and expenses with amount, date, category, and optional descriptions (e.g. "Rent – July", "Coffee out").
- **Smart search & filtering** — find any transaction instantly by text (searching category names and descriptions) or filter by type (all / expenses only / income only).
- **Real-time cloud sync** — data syncs instantly across devices via Firebase Firestore, so your finances are always up to date wherever you open the app.
- **Mobile-first & PWA** — a bottom navigation bar and touch-friendly interface that feels like a native mobile app.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (glassmorphism, dark mode)
- **Backend / Database:** Firebase Cloud Firestore
- **Authentication:** Firebase Auth (Google Sign-In)
- **Icons & branding:** Lucide React, custom SVG logo
- **Hosting:** Google Cloud Run

## 🏗️ How It Works

CoinJar is a serverless single-page app. The React/TypeScript frontend talks directly to Firebase: users authenticate with Google via Firebase Auth, and all transactions, wallets, and settings are stored in Cloud Firestore. Firestore's real-time listeners keep the UI in sync across devices automatically, with no custom backend server to maintain. The whole app is containerized and deployed on Google Cloud Run.

## 🧠 Key Design Decisions

This section shows the thinking behind the build, not just the feature list:

- **Per-user data isolation enforced at the database level** — Firestore security rules ensure every user can only read and write **their own** data (`request.auth.uid == resource.data.userId`), rather than trusting the client. This is the real security boundary of the app, not the client-side config.
- **Serverless architecture** — using Firebase Auth + Firestore removes the need for a custom backend, which keeps the app simple, cheap to run, and easy to scale.
- **Mobile-first, minimalist UX** — a deliberate product choice to serve users who want a fast, clear view of their spending instead of a feature-heavy accounting tool.

## 🔒 Security Notes

- No secrets are committed to the repository (`.env.local` is git-ignored; only `.env.example` is included).
- The Firebase config in `firebase-applet-config.json` is **public by design** — it identifies the project but does not grant data access. Access is controlled entirely by the Firestore security rules described above.

## 🚀 Run Locally

**Prerequisites:** Node.js

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Firebase project configuration is included in `firebase-applet-config.json`. To run against your own Firebase project, replace it with your project's config and deploy the rules from `firestore.rules`.

## 🗺️ Roadmap (Next Iterations)

- [ ] Recurring transactions (subscriptions, rent) added automatically.
- [ ] Budget goals per category with progress indicators.
- [ ] Charts and spending trends over time.
- [ ] Export to CSV.

## 👤 Author

`[Artur Jachimczak]` — Project Manager growing into **AI Product Management** and building things end-to-end.

`www.linkedin.com/in/artur-jachimczak-artur-jachimczak-pm`

---

*Built as part of a portfolio demonstrating product thinking, full-stack app design, and deployment on modern serverless infrastructure.*
