

# Portfolio Showcase

A modular web application to showcase your software projects. Built with a Vite-powered React SPA and a FastAPI backend, this project supports:

- Browsing and filtering projects by technology tag
- Markdown-formatted project details with image carousel
- JWT authentication (guest vs. admin roles)
- Admin CRUD operations on projects


---

## 📦 Tech Stack

| Layer        | Technology                                |
| ------------ | ----------------------------------------- |
| Frontend     | React 18, Vite, SWC, React Router v6      |
| Backend      | Python 3.10+, FastAPI, SQLAlchemy         |
| Database     | PostgreSQL           |
| Auth         | JWT (HS256), OAuth2PasswordRequestForm    |
| Deployment   | Render (Web Service & Static Site)       |
| CI/CD        | GitHub Actions                           |
| Extras       | Celery/RQ, SendGrid, Sentry   |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥18 and npm
- Python ≥3.10 and pip
- A Render account (for production)

### 1. Clone the repository

```bash
git clone https://github.com/HolubVisionAI/project-insight-display.git
cd portfolio-showcase
````

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # on Windows use `.venv\Scripts\activate`
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/portfolio
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173
```

Run database migrations / create tables:

```bash
python -c "from src.db.models import Base; from src.db.database import engine; Base.metadata.create_all(bind=engine)"
```

Start the FastAPI server:

```bash
uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

### 3. Frontend Setup

```bash
cd ../frontend
npm ci
```

Create a `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🛠️ Environment Variables

| Name               | Description                                        |
| ------------------ | -------------------------------------------------- |
| `VITE_API_URL`     | URL of the backend API (used by the frontend)      |
| `DATABASE_URL`     | SQLAlchemy DB URL                                  |
| `JWT_SECRET`       | Secret key for signing JWTs                        |
| `ALLOWED_ORIGINS`  | Comma-separated list for FastAPI CORS middleware   |
| `SENDGRID_API_KEY` | (Optional) API key for sending emails via SendGrid |
| `NOTIFY_EMAIL`     | (Optional) Recipient for automated notifications   |

---

## 🗂️ Project Structure

```
repo/
├── frontend/          # Vite + React source
│   ├── src/
│   ├── public/
│   └── vite.config.ts
├── backend/           # FastAPI source
│   ├── src/
│   │   ├── routes/       # routers: auth, projects, analytics, chat
│   │   ├── db/        # models, schemas, database
│   │   └── main.py
│   └── requirements.txt
└── README.md          # This file
```

---

## 🔗 API Endpoints

### Auth

* `POST /api/v1/auth/register` – register new user
* `POST /api/v1/auth/login`    – obtain JWT token

### Projects

* `GET    /api/v1/projects`           – list with filter, pagination
* `GET    /api/v1/projects/{id}`      – detail + auto-increment view count
* `POST   /api/v1/projects`           – create (admin only)
* `PUT    /api/v1/projects/{id}`      – update (admin only)
* `DELETE /api/v1/projects/{id}`      – delete (admin only)

---

## 📦 Deployment

1. **Frontend**:

   * Link `frontend/` to Render Static Site (or Netlify).
   * Set `VITE_API_URL` in Environment.

2. **Backend**:

   * Link `backend/` to Render Web Service.
   * Set build & start commands:

     ```
     pip install -r requirements.txt
     uvicorn src.main:app --host 0.0.0.0 --port $PORT
     ```
   * Define the same env vars as local.

---

## 🤝 Contributing

Feel free to open issues or PRs to add new modules, improve tests, or enhance docs.

---

## 📝 License

MIT © \[Ihor Holub]

