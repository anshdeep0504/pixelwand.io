# Backend API for Smart Shareable Portfolio

## Setup

1. Create a `.env` file in the backend directory with the following content:

```
MONGO_URI=mongodb+srv://shellygarg3522:JJof8Mo2xXyv9ViH@cluster0.5trvd.mongodb.net/teamsyc
JWT_SECRET=supersecretkey
PORT=5000
```

2. Install dependencies:

```
npm install
```

3. Start the server:

```
node index.js
```

## API Endpoints

- `POST /api/signup` — Register a new user. Body: `{ email, password }`
- `POST /api/login` — Login. Body: `{ email, password }`
- `GET /api/protected` — Example protected route. Requires `Authorization: Bearer <token>` header. 