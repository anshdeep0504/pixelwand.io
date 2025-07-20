# 📊 Smart Shareable Portfolio

Smart Shareable Portfolio is an end-to-end platform that allows users to create investment portfolios with stocks and cash, generate a **secure, persistent shareable link**, and provide AI-powered insights to anyone who opens the link — no login required.

---

## 📁 Project Folder Structure

```
smart-shareable-portfolio/
│
├── backend/           # Node.js/Express API, MongoDB, JWT auth
│   ├── index.js
│   ├── package.json
│   └── ...
│
├── frontend/          # React (Vite, TypeScript, Tailwind CSS)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── README.md          # Project documentation (this file)
└── .gitignore
```

---

## 🎯 Features

- Create and manage portfolios with tickers, quantities, and cash.
- Generate special long-term **shareable links** that persist across devices.
- Recipients can:
  - View full portfolio breakdown
  - See AI-generated insights
  - Analyze sector and risk exposure
- Access persists even if recipients later log in.
- Insights update dynamically with real-time market data.

---

## 🧠 Frontend (AI Studio App)

### Run Locally

**Requirements:** Node.js

1. Go to the frontend directory:
   ```bash
   cd frontend
   ```
2. Create a `.env.local` file:
   ```env
   VITE_API_URL=http://localhost:5000
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔧 Backend (Express + MongoDB)

### Setup Instructions

1. Create a `.env` file in the backend directory with the following:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```

---

## 📡 API Endpoints

### POST `/api/signup`
Register a new user.
**Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### POST `/api/login`
Login and receive JWT.
**Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### GET `/api/protected`
Protected route example.
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔑 Notes
- To integrate AI insights, get a Gemini API Key.
- To store portfolios, create a free MongoDB Atlas cluster and use the provided connection string in your `.env`.
- Optionally, Prisma can be used for advanced database modeling and querying.

---

## 🧠 Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Gemini API
- **Backend:** Node.js, Express, MongoDB, JWT
- **Deployment (optional):** Vercel (frontend), Render/Fly.io/Railway (backend)

---

## 🚀 Deployment
- Deploy the backend to [Render](https://render.com/), [Railway](https://railway.app/), or [Fly.io](https://fly.io/).
- Deploy the frontend to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/).
- Set environment variables in your deployment dashboard as shown above.

---

## 📄 License
MIT License. Open to contributions and feature ideas! 