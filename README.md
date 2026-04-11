# GDPR AI Assistant

A production-grade MERN stack AI chatbot for GDPR compliance and cybersecurity, powered by Groq API with RAG (Retrieval-Augmented Generation).

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + MongoDB
- **AI**: Groq API (llama3-70b-8192) with RAG pipeline
- **Search**: TF-IDF semantic search (no external embedding service needed)

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI and GROQ_API_KEY
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Seed Knowledge Base
- Visit http://localhost:5173/login
- Login as admin: admin@gdpr.ai / Admin@1234
- Go to Admin Panel → Click "Seed Data"
- OR run: `cd backend && npm run seed`

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_32_char_secret
GROQ_API_KEY=gsk_...
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
GROQ_MODEL=llama3-70b-8192
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Features
- ✅ RAG-powered chatbot (no hallucination)
- ✅ GDPR Articles 1-99 indexed
- ✅ Cybersecurity PDF knowledge base
- ✅ JWT authentication + RBAC
- ✅ Chat history & bookmarks
- ✅ Dark mode glassmorphism UI
- ✅ Admin panel with PDF upload
- ✅ Zero Trust security architecture

## Deployment
- **Frontend**: Deploy `frontend/` to Vercel
- **Backend**: Deploy `backend/` to Railway or Render
- **Database**: MongoDB Atlas (free tier)
- **Get Groq API key**: https://console.groq.com (free)

## API Endpoints
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/chat
POST /api/chat/message
GET  /api/articles
GET  /api/articles/search?q=...
POST /api/admin/seed
POST /api/admin/upload-pdf
```
