# Pixelwand.io – Smart Shareable Portfolio

A fullstack portfolio app with AI-powered insights, real-time charts, JWT auth, and public sharing. Built with React, Node.js, MongoDB, and Google Gemini AI.

---

## Project Structure
```
project-root/
│
├── backend/      # Node.js/Express API, MongoDB, JWT auth
│   └── ...
│
├── frontend/     # React (Vite, TypeScript, Tailwind CSS)
│   └── ...
│
├── README.md     # This file
└── .gitignore
```

---

## How to Run Locally

### 1. **Backend**
```bash
cd backend
npm install
# Set up .env with MONGO_URI, JWT_SECRET, PORT
npm start
```
- Runs on `http://localhost:5000`

### 2. **Frontend**
```bash
cd frontend
npm install
# Set VITE_API_URL in .env to your backend URL
npm run dev
```
- Runs on `http://localhost:5173`

---

## Prompt Design (Gemini AI)
- The system prompt instructs Gemini to always answer in a single, concise sentence (one-liner), never a paragraph or list, and never more than 20 words.
- If the answer can't fit, Gemini must summarize in one sentence.
- This ensures fast, actionable, and readable AI insights for every portfolio question.

---

## Limitations & What’s Next
- **Limitations:**
  - AI cannot give personalized or regulated financial advice.
  - No real-time brokerage integration (data is as fresh as the APIs allow).
  - No multi-user collaboration or notifications yet.
- **What’s Next:**
  - Mobile app version
  - More advanced AI (trend detection, scenario simulation)
  - Social features (follow, comment, leaderboard)
  - Customizable dashboard widgets

---

**MIT License** 