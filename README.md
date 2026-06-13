
```markdown
# AceIt — AI-Powered Interview Coach

> I built AceIt to solve a real problem I faced — there was no single platform that combined CV analysis, AI interview practice, skill testing, and personalized feedback in one place. So I built it myself.

AceIt is a full-stack SaaS platform that helps developers and job seekers prepare smarter and interview better. It combines AI-powered CV scoring, live mock interviews, skill quizzes, and a personalized improvement roadmap — all in one premium platform.

---

## What I Built

### CV Review
Upload your CV as a PDF and get an honest, detailed ATS analysis powered by OpenAI. The system extracts your CV text, runs it through an AI that thinks like a real ATS recruiter, and returns a score out of 100 with a full breakdown of formatting, content, and keyword gaps — plus specific, actionable improvements you can apply immediately.

### AI Interview
Start a live mock interview session by choosing your major, job title, experience level, and years of experience. The AI generates 7 tailored technical and behavioral questions — and it never repeats a question. After each answer, you get a score out of 10, honest feedback, and the ideal answer. When you finish, you get a full report with your overall score, hire recommendation, top strengths, areas to improve, and recommended learning resources.

### Skill Quizzes
Generate AI-powered multiple choice quizzes tailored to your exact tech stack and job position. Choose between 5, 10, 15, or 20 questions. After submitting, you see every question broken down — your answer, the correct answer, and whether you got it right. Wrong answers are automatically added to your roadmap.

### Personalized Roadmap
Every CV review, interview, and quiz automatically feeds into your roadmap. Weaknesses become improvement tasks sorted by priority (high, medium, low). You can mark items as done, filter by type and status, and track your overall completion progress. The roadmap is your personal study plan.

### Reports
A full performance dashboard showing your stats across all three features — total sessions, average scores, best scores, and a recent activity feed. The overview card shows your overall score across all features. Pro users can export a professional PDF report of their full performance history.

### Subscription Plans
Three tiers with real usage limits enforced at the API level. Free users get a taste of everything. Basic unlocks more sessions. Pro removes all limits and adds PDF export and priority support. The upgrade flow includes a full mock payment UI with a card form, card preview animation, and a 2-second processing simulation.

### Settings
A full settings panel with five tabs: Profile (name, email, avatar picker with 12 icons like Duolingo), Security (change password with current/new/confirm fields and show/hide toggle), Plan & Billing (current plan details, usage limits, cancel subscription), Preferences (default major and experience level, email notifications toggle), and Danger Zone (3-step account deletion with password confirmation).

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MySQL 8.0 | Relational database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing (10 rounds) |
| OpenAI API (GPT-4o-mini) | CV analysis, interview questions, scoring, quizzes |
| AWS S3 | Encrypted CV PDF storage with pre-signed URLs |
| Multer | PDF file upload handling |
| pdf2json | PDF text extraction |
| express-rate-limit | Brute force and API rate limiting |
| helmet | Security HTTP headers |
| morgan | HTTP request logging |
| Docker + docker-compose | Containerized deployment |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| Framer Motion | Page transitions, scroll animations, hover effects |
| Lucide React | Icon library |
| Axios | HTTP client with auto token injection and 401 handling |
| React Router v6 | Client-side routing with protected routes |
| React Hot Toast | Toast notifications |
| jsPDF | PDF report generation and download |

### Infrastructure
| Service | Purpose |
|---|---|
| AWS EC2 | Backend server (Docker container) |
| AWS S3 | CV file storage |
| Vercel | Frontend deployment |
| MySQL 8.0 | Production database |

---

## Database — 9 Tables

```
users                 — accounts, plan, avatar, preferences
subscriptions         — plan history, payment references, expiry
cv_reviews            — uploaded CVs, ATS scores, AI feedback (JSON)
interview_sessions    — session config, status, overall score
interview_questions   — questions, answers, AI feedback, scores
quiz_sessions         — quiz config, score, completion
quiz_questions        — questions, options (JSON), answers, results
roadmap_items         — improvement suggestions by type and priority
usage_tracking        — per-feature usage counts for free tier limits
```

---

## API Reference

### Authentication
```
POST   /api/auth/register          Create account
POST   /api/auth/login             Login and get JWT
GET    /api/auth/me                Get current user
PUT    /api/auth/profile           Update profile, avatar, preferences
PUT    /api/auth/change-password   Change password
DELETE /api/auth/delete-account    Delete account with password confirmation
```

### CV Review
```
POST   /api/cv/upload     Upload PDF, analyze with AI, save to S3
GET    /api/cv/history    All CV reviews for the current user
GET    /api/cv/:id        Single review with pre-signed S3 download URL
```

### AI Interview
```
POST   /api/interview/start           Start session, generate first question
POST   /api/interview/:id/answer      Submit answer, get feedback + next question
POST   /api/interview/:id/complete    End session, generate full report
GET    /api/interview/history         All past sessions
GET    /api/interview/:id             Single session with all questions
```

### Quiz
```
POST   /api/quiz/start        Generate quiz questions with AI
POST   /api/quiz/:id/submit   Submit all answers, get scored results
GET    /api/quiz/history      All past quizzes
GET    /api/quiz/:id          Single quiz with full question breakdown
```

### Roadmap
```
GET    /api/roadmap              Get all items grouped by priority
PATCH  /api/roadmap/:id/toggle   Mark item as done or pending
DELETE /api/roadmap/:id          Remove item
```

### Reports
```
GET    /api/reports/summary       Overall stats + recent activity
GET    /api/reports/interviews    All interview sessions with scores
GET    /api/reports/cv            All CV reviews with sub-scores
GET    /api/reports/quizzes       All quizzes with correct/wrong breakdown
```

### Subscription
```
GET    /api/subscription/plans    Available plans and features
GET    /api/subscription/current  Current plan and subscription details
POST   /api/subscription/upgrade  Upgrade to basic or pro
POST   /api/subscription/cancel   Cancel and return to free
```

---

## Subscription Plans

| Feature | Free | Basic | Pro |
|---|---|---|---|
| CV Reviews | 1 | 5 / month | Unlimited |
| AI Interviews | 1 | 5 / month | Unlimited |
| Skill Quizzes | 3 | 20 / month | Unlimited |
| Full Reports | ✅ | ✅ | ✅ |
| Roadmap Access | ✅ | ✅ | ✅ |
| PDF Export | — | — | ✅ |
| Priority Support | — | — | ✅ |
| Price | $0 | $9.99 / mo | $19.99 / mo |

---

## Security

- JWT on every protected route — no exceptions
- bcrypt password hashing with 10 salt rounds
- Rate limiting: 10 login attempts per 15 min, 500 API calls per 15 min
- AWS S3 private bucket — files only accessible via pre-signed URLs (1 hour expiry)
- SQL injection prevention via parameterized queries on every database call
- Global error handler — never exposes stack traces or SQL errors in production
- CORS restricted to frontend origin only
- Helmet.js security headers on all responses
- Free tier usage enforced at controller level — not just in the UI

---

## Running Locally

### Prerequisites
- Node.js v20+
- MySQL 8.0
- Docker Desktop
- OpenAI API Key
- AWS Account with S3 bucket

### 1. Clone
```bash
git clone https://github.com/Abdallah-khatib-7/aceit.git
cd aceit
```

### 2. Database setup
```bash
cd backend
mysql -u root -p < src/db/init.sql
```

### 3. Environment variables
Create `backend/.env` with the following:
```
PORT=5000
NODE_ENV=development
DB_HOST=
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=aceit
JWT_SECRET=
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
CLIENT_URL=http://localhost:5173
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=aceit-cv-uploads
```

### 4. Run backend
```bash
cd backend
npm install
npm run dev
```

### 5. Run frontend
```bash
cd frontend
npm install
npm run dev
```

### 6. Run with Docker
```bash
docker-compose up --build
```

---

## Project Structure

```
aceit/
├── backend/
│   ├── src/
│   │   ├── controllers/        authController, cvController, interviewController,
│   │   │                       quizController, reportsController, roadmapController,
│   │   │                       subscriptionController
│   │   ├── routes/             auth, cv, interview, quiz, reports, roadmap, subscription
│   │   ├── services/           openai.service.js, s3.service.js
│   │   ├── middleware/         auth.js, errorHandler.js, rateLimiter.js
│   │   ├── db/                 database.js, init.sql
│   │   └── utils/              cvParser.js
│   ├── Dockerfile
│   ├── index.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/              Landing, Login, Register, Dashboard, CvReview,
│   │   │                       Interview, Quiz, Roadmap, Reports, Settings, Pricing
│   │   ├── components/
│   │   │   └── layout/         PageNavbar.jsx
│   │   ├── context/            AuthContext.jsx
│   │   ├── hooks/              useWindowSize.js
│   │   └── services/           api.js
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

---

## Deployment

- **Backend** — AWS EC2 (eu-north-1) running Node.js inside a Docker container
- **Frontend** — Vercel with automatic deployments from GitHub
- **File Storage** — AWS S3 private bucket with pre-signed URL access
- **Database** — MySQL 8.0

---

## About

I'm Abdallah Khatib, a Computer Science graduate from Lebanese International University 🇱🇧. AceIt is my third major full-stack project, following PharmaCare (pharmacy management system) and Tawla (SaaS restaurant POS with real-time Socket.io and multi-tenant architecture).

I built AceIt to demonstrate production-level full-stack development with AI integration, cloud infrastructure (AWS S3 + EC2), containerization (Docker), and a complete SaaS business model.

- **GitHub:** [Abdallah-khatib-7](https://github.com/Abdallah-khatib-7)
- **Email:** abdallah.khatib2003@gmail.com
```

