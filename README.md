# AceIt — AI Interview Coach
 ![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-S3+EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-Portfolio-orange?style=for-the-badge)
A full-stack, AI-powered SaaS platform that helps developers and job seekers prepare smarter and interview better.

CV scoring · AI mock interviews · Skill quizzes · Personalized roadmap · PDF reports

---

## About

I built AceIt because there was no single platform that combined honest CV analysis, live AI interview practice, skill testing, and a personalized improvement plan in one place. So I built it myself — from the database schema to the deployment pipeline.

AceIt is not a generic interview tool. It was designed around the real job-seeking workflow of a developer — from uploading your CV and getting brutally honest ATS feedback, to going through a full mock interview session with an AI that never repeats a question, to tracking your progress over time with detailed reports and a personal roadmap that updates automatically after every session.

Built by Abdallah Khatib — a Computer Science graduate from Lebanese International University, and the developer behind PharmaCare and Tawla (SaaS restaurant POS).

---

## ✨ Key Features

### 📄 CV Review
- Upload your CV as a PDF — extracted and analyzed entirely server-side
- AI scores your CV out of 100 exactly like a real ATS system
- Full breakdown: formatting score, content score, keyword score
- Identifies missing keywords, specific weaknesses, and actionable improvements
- Every weakness auto-generates a roadmap item
- Past reviews are saved and fully accessible with one click
- CV stored securely on AWS S3 with pre-signed URL access

### 🧠 AI Interview
- Choose your major, job title, experience level, and years of experience
- AI generates 7 tailored questions — technical, behavioral, and situational
- Strict no-repeat logic — every asked question is passed back to the AI so it never generates the same question twice in a session
- Each answer is scored out of 10 with specific feedback and the ideal answer revealed
- Progress bar tracks questions answered in real time
- Full report at the end: overall score, hire recommendation, top strengths, areas to improve, recommended resources
- Past sessions are saved, clickable, and show the full reconstructed report

### ⚡ Skill Quizzes
- AI generates multiple choice quizzes tailored to your exact job title and tech stack
- Choose between 5, 10, 15, or 20 questions
- Answer one question at a time with a clean radio-button UI
- After submission: full breakdown of every question — your answer, correct answer, right or wrong
- Wrong answers automatically generate roadmap improvement items
- Past quizzes saved and fully clickable to review the breakdown

### 🗺️ Roadmap
- Auto-populated from every CV review, interview session, and quiz you complete
- Items sorted by priority: high → medium → low
- Filter by status (all / pending / done) and by type (CV / interview / quiz)
- Mark items done with one click — strikethrough animation, re-clickable to undo
- Delete items you no longer need
- Progress bar shows overall completion percentage with live stats per priority level

### 📊 Reports
- Full performance dashboard across all three features
- Overall score card combining CV, interview, and quiz averages with animated score bars
- Separate tabs for Interviews, CV Reviews, and Quizzes — each with a summary banner and full session list
- Every session row shows a mini score bar and is clickable
- Recent activity feed across all feature types
- Pro users can export a professional PDF report with full stats, session history, and recent activity

### 💳 Subscription Plans
- Three tiers enforced at the API level — not just in the UI
- Free tier: 1 CV review, 1 interview, 3 quizzes
- Basic ($9.99/month): 5 CV reviews, 5 interviews, 20 quizzes, full reports
- Pro ($19.99/month): unlimited everything + PDF export + priority support
- Upgrade flow includes a full mock payment UI: animated card preview, card number formatter, expiry formatter, 2-second processing simulation, success screen
- Cancel subscription from settings — instantly returns user to free plan

### ⚙️ Settings
- **Profile tab** — change name, email, choose avatar from 12 icons (like Duolingo)
- **Security tab** — change password with current/new/confirm fields, show/hide toggle on all fields
- **Plan & Billing tab** — current plan card with usage limits, cancel subscription button
- **Preferences tab** — default major, default experience level, email notifications toggle
- **Danger Zone tab** — 3-step account deletion: first confirm → second confirm → enter password → permanently deleted

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MySQL 8.0 | Relational database |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing (10 salt rounds) |
| OpenAI API (GPT-4o-mini) | CV analysis, interview generation, scoring, quiz generation |
| AWS S3 (@aws-sdk/client-s3) | Encrypted PDF storage with pre-signed URL access |
| Multer | PDF file upload handling (memory storage, 5MB limit) |
| pdf2json | Server-side PDF text extraction |
| express-rate-limit | Brute force protection on login and API routes |
| helmet | Security HTTP headers |
| morgan | HTTP request logging |
| dotenv | Environment variable management |
| nodemon | Development auto-reload |
| Docker + docker-compose | Containerized production deployment |

### Frontend

| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| Framer Motion | Page transitions, scroll reveals, hover animations, AnimatePresence |
| Lucide React | Icon library |
| Axios | HTTP client with auto JWT injection and 401 redirect handler |
| React Router v6 | Client-side routing with protected route guards |
| React Hot Toast | Toast notifications |
| jsPDF | Client-side PDF report generation and download |

### Infrastructure

| Service | Purpose |
|---|---|
| AWS EC2 (eu-north-1) | Backend server running inside Docker container |
| AWS S3 (eu-north-1) | Private CV file storage |
| Vercel | Frontend deployment with automatic GitHub deploys |
| MySQL 8.0 | Production database |

---

## 🗄️ Database — 9 Tables

| Table | Purpose |
|---|---|
| users | Accounts, plan, avatar, default preferences, email notifications |
| subscriptions | Plan history, started/expiry dates, payment references |
| cv_reviews | Uploaded CVs, S3 URLs, ATS scores, full AI feedback (JSON) |
| interview_sessions | Session config (major, job, level, years), status, overall score |
| interview_questions | Questions, user answers, AI feedback (JSON), scores per question |
| quiz_sessions | Quiz config, total questions, correct answers, final score |
| quiz_questions | Questions, options (JSON), correct answer, user answer, is_correct |
| roadmap_items | Improvement suggestions by source type and priority, done status |
| usage_tracking | Per-feature usage records for free tier limit enforcement |

---

## 📡 API Reference

### Authentication
```
POST   /api/auth/register            Create account — returns JWT
POST   /api/auth/login               Login — returns JWT
GET    /api/auth/me                  Get current user from token
PUT    /api/auth/profile             Update name, email, avatar, preferences
PUT    /api/auth/change-password     Change password with current password verification
DELETE /api/auth/delete-account      Delete account with password confirmation
```

### CV Review
```
POST   /api/cv/upload      Upload PDF → extract text → analyze with AI → save to S3 → return full feedback
GET    /api/cv/history     All CV reviews for the logged-in user (list view)
GET    /api/cv/:id         Single review with full AI feedback + pre-signed S3 download URL
```

### AI Interview
```
POST   /api/interview/start           Create session → generate first question with AI
POST   /api/interview/:id/answer      Submit answer → score with AI → generate next question (no repeats)
POST   /api/interview/:id/complete    End session → generate full report with AI → save to DB
GET    /api/interview/history         All past sessions for the logged-in user
GET    /api/interview/:id             Single session with all questions and answers
```

### Quiz
```
POST   /api/quiz/start        Generate all questions at once with AI → save to DB → return to frontend
POST   /api/quiz/:id/submit   Submit all answers → score → save results → generate roadmap items for wrong answers
GET    /api/quiz/history      All past quizzes for the logged-in user
GET    /api/quiz/:id          Single quiz with full question breakdown
```

### Roadmap
```
GET    /api/roadmap              All items grouped by priority (high / medium / low)
PATCH  /api/roadmap/:id/toggle   Toggle item between done and pending
DELETE /api/roadmap/:id          Delete a roadmap item
```

### Reports
```
GET    /api/reports/summary       Overall stats across all features + recent activity feed
GET    /api/reports/interviews    All interview sessions with questions answered and avg score
GET    /api/reports/cv            All CV reviews with formatting, content, keyword sub-scores
GET    /api/reports/quizzes       All quizzes with correct/wrong counts and final score
```

### Subscription
```
GET    /api/subscription/plans    All available plans with features and pricing
GET    /api/subscription/current  Current plan + active subscription details
POST   /api/subscription/upgrade  Upgrade to basic or pro with payment reference
POST   /api/subscription/cancel   Cancel subscription — user returns to free plan immediately
```

---

## 💡 Key Business Logic

| Feature | Logic |
|---|---|
| No-repeat questions | Every question asked in a session is passed back to the AI on the next call — it is physically impossible for the AI to repeat a question |
| Free tier enforcement | Usage is tracked per user per feature in the database — limits are checked in the controller before any AI call is made |
| CV extraction | PDF is uploaded to memory (never written to disk), text is extracted server-side with pdf2json, then sent to OpenAI |
| S3 access | Bucket is fully private — files are only accessible via pre-signed URLs with a 1-hour expiry |
| Roadmap auto-generation | Every CV weakness, every interview area to improve, and every wrong quiz answer automatically creates a roadmap item |
| Password policy | New password must differ from current password — enforced at the API level, not just the UI |
| Subscription enforcement | Plan limits are checked at the controller level — a Pro user who downgrades cannot bypass limits by calling the API directly |
| Avatar persistence | Avatar selection is saved to the database and returned on every `/api/auth/me` call — persists across sessions |

---

## 🔒 Security

- JWT authentication on every protected route — no exceptions
- bcrypt password hashing with 10 salt rounds
- Rate limiting: 10 login attempts per 15 minutes, 500 API calls per 15 minutes
- AWS S3 private bucket — zero public access, pre-signed URLs expire after 1 hour
- SQL injection prevention via parameterized queries on every single database call
- Global error handler — never exposes stack traces, SQL errors, or internal details in production
- CORS restricted to frontend origin only
- Helmet.js security headers on all responses
- `.env` never committed — enforced via `.gitignore`
- 3-step account deletion with password re-confirmation

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MySQL 8.0
- Docker Desktop
- OpenAI API Key
- AWS Account (S3 bucket + EC2)

### 1. Clone the repository
```bash
git clone https://github.com/Abdallah-khatib-7/aceit.git
cd aceit
```

### 2. Set up the database
```bash
cd backend
mysql -u root -p < src/db/init.sql
```

### 3. Configure environment variables
Create `backend/.env`:
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=aceit

JWT_SECRET=your_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d

OPENAI_API_KEY=your_openai_api_key

CLIENT_URL=http://localhost:5173

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=aceit-cv-uploads
```

### 4. Install and run the backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 5. Install and run the frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### 6. Run with Docker
```bash
docker-compose up --build
```

---

## 📁 Project Structure

```
aceit/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js         Register, login, me, profile, password, delete
│   │   │   ├── cvController.js           Upload, analyze, history, single review
│   │   │   ├── interviewController.js    Start, answer, complete, history, single session
│   │   │   ├── quizController.js         Start, submit, history, single quiz
│   │   │   ├── reportsController.js      Summary, interviews, CV, quizzes
│   │   │   ├── roadmapController.js      Get, toggle, delete
│   │   │   └── subscriptionController.js Plans, current, upgrade, cancel
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── cv.js
│   │   │   ├── interview.js
│   │   │   ├── quiz.js
│   │   │   ├── reports.js
│   │   │   ├── roadmap.js
│   │   │   └── subscription.js
│   │   ├── services/
│   │   │   ├── openai.service.js         CV analysis, interview generation, scoring, quiz generation
│   │   │   └── s3.service.js             Upload, get pre-signed URL, delete
│   │   ├── middleware/
│   │   │   ├── auth.js                   JWT verification
│   │   │   ├── errorHandler.js           Global error handler (safe for production)
│   │   │   └── rateLimiter.js            Login + API rate limiting
│   │   ├── db/
│   │   │   ├── database.js               MySQL connection pool
│   │   │   └── init.sql                  Full schema — 9 tables
│   │   └── utils/
│   │       └── cvParser.js               PDF text extraction with pdf2json
│   ├── Dockerfile
│   ├── index.js                          Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx               Public marketing page with Unsplash images + FAQ accordion
    │   │   ├── Login.jsx                 Login with show/hide password
    │   │   ├── Register.jsx              Two-panel registration with perks list
    │   │   ├── Dashboard.jsx             Stats, quick actions, recent activity, upgrade banner
    │   │   ├── CvReview.jsx              Upload, ATS score ring, sub-scores, strengths, weaknesses, keywords
    │   │   ├── Interview.jsx             Setup, question flow, feedback, full report
    │   │   ├── Quiz.jsx                  Setup, question-by-question UI, result breakdown
    │   │   ├── Roadmap.jsx               Progress bar, filters, toggle done, delete
    │   │   ├── Reports.jsx               Overview + tabbed breakdown + PDF export
    │   │   ├── Settings.jsx              Profile, security, plan, preferences, danger zone
    │   │   └── Pricing.jsx               Plans comparison + mock payment modal with card UI
    │   ├── components/
    │   │   └── layout/
    │   │       └── PageNavbar.jsx        Shared navbar with mobile hamburger menu
    │   ├── context/
    │   │   └── AuthContext.jsx           Auth provider — user, token, login, logout
    │   ├── hooks/
    │   │   └── useWindowSize.js          useIsMobile + useIsTablet hooks
    │   └── services/
    │       └── api.js                    Axios instance with JWT injection + 401 handler
    └── vite.config.js
```

---

## 🗺️ Roadmap

- [ ] Stripe / Tap Payments integration for real payments
- [ ] Voice-based interview mode
- [ ] LinkedIn job import — paste a job URL, AI tailors questions to that exact listing
- [ ] Company-specific interview packs (Google, Meta, Amazon style)
- [ ] Leaderboard — compare your scores anonymously with other users
- [ ] Interview recording with playback and AI analysis
- [ ] Resume builder integrated with CV review feedback
- [ ] Mobile app (React Native)

---

## 👨‍💻 About

I'm Abdallah Khatib, a Computer Science graduate from Lebanese International University 🇱🇧. AceIt is my third major full-stack project, following:

- **PharmaCare** — a professional pharmacy management system with AI-powered drug interaction checking and prescription management
- **Tawla** — a multi-tenant SaaS restaurant POS with real-time Socket.io, kitchen display system, delivery management, and AI upsell suggestions

I built all three systems from scratch — database design, backend API, frontend UI, and deployment. No templates, no boilerplate, no shortcuts.

💼 [LinkedIn](https://linkedin.com/in/abdallah-khatib)
🐙 [GitHub](https://github.com/Abdallah-khatib-7)
📧 abdallah.khatib2003@gmail.com

---

## 📄 License

This project is for portfolio and demonstration purposes. All rights reserved © 2026 Abdallah Khatib.