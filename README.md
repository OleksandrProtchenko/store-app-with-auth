# Store App with Auth

A web application for managing orders and products with a full authentication system.

## Features

- User registration and login (JWT, httpOnly cookies, refresh token rotation)
- View, create, edit and delete orders
- Add and remove products within orders
- Browse products grouped by order (Groups page)
- Order total calculation by currency
- Protected routes with automatic access token refresh
- Responsive UI

## Tech Stack

**Frontend**

- Next.js 16 (App Router)
- React 19
- TypeScript
- TanStack Query (server state)
- Zustand (client state)
- Axios
- CSS Modules

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- cookie-parser

**Infrastructure**

- Docker + Docker Compose
- Railway (deployment)

## Project Structure

```
store-app-with-auth/
├── backend/          # Express API
│   ├── src/
│   │   ├── config/   # Database connection
│   │   ├── middleware/# JWT auth middleware
│   │   ├── models/   # Mongoose schemas
│   │   └── routes/   # Auth and Orders routes
│   └── Dockerfile
├── frontend/         # Next.js app
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # API client, store
│   └── Dockerfile
├── docker-compose.yml
└── schema.sql        # DB schema (MySQL Workbench)
```

## API

**Auth** — `/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout |

**Orders** — `/orders` (requires auth)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/orders` | Get all user orders |
| POST | `/orders` | Create an order |
| PUT | `/orders/:id` | Update an order |
| DELETE | `/orders/:id` | Delete an order |
| POST | `/orders/:id/products` | Add a product |
| DELETE | `/orders/:id/products/:productId` | Remove a product |

## Running Locally

### With Docker

```bash
docker compose up --build
```

Open: http://localhost:3000

### Without Docker

**Backend:**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `backend/.env` based on `backend/.env.example`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/store
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
PORT=5000
```

Frontend variable (optional):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```
