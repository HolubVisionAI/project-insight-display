# Portfolio Showcase Backend

This is the backend API for the Portfolio Showcase application, built with FastAPI.

## Features

- RESTful API endpoints for projects management
- JWT-based authentication
- WebSocket support for real-time chat
- Analytics tracking
- File upload support
- PostgreSQL/SQLite database support

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with the following variables:
```
DATABASE_URL=sqlite:///./portfolio.db
JWT_SECRET=your-super-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:3000
SENDGRID_API_KEY=your-sendgrid-api-key
NOTIFY_EMAIL=your-email@example.com
CHAT_MODEL=rule-based
```

4. Run the development server:
```bash
uvicorn main:app --reload
```

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): http://localhost:8000/docs
- Alternative API docs (ReDoc): http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token

### Projects
- `GET /api/v1/projects` - List all projects
- `GET /api/v1/projects/{id}` - Get project details
- `POST /api/v1/projects` - Create new project (admin only)
- `PUT /api/v1/projects/{id}` - Update project (admin only)
- `DELETE /api/v1/projects/{id}` - Delete project (admin only)

### Analytics
- `POST /api/v1/analytics/views` - Record page view
- `GET /api/v1/analytics/views` - Get view statistics (admin only)
- `GET /api/v1/analytics/tags/popularity` - Get tag popularity (admin only)

### Chat
- `POST /api/v1/chat` - Send chat message
- `WS /api/v1/chat/ws/{session_id}` - WebSocket chat endpoint

## Development

### Running Tests
```bash
pytest
```

### Code Style
The project uses Black for code formatting and Flake8 for linting:
```bash
black .
flake8
```

## Deployment

The application is designed to be deployed on Render's free tier. Make sure to:
1. Set up environment variables in Render's dashboard
2. Use PostgreSQL in production
3. Configure CORS for your frontend domain
4. Use a strong JWT secret 