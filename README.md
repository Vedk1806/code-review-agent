# 🤖 Code Review Agent

AI-powered GitHub Pull Request code reviewer using Gemini API, FastAPI, and React.

## Features
- Paste any GitHub PR URL and get instant AI-powered code review
- Detects bugs, security issues, and suggests improvements
- Clean dark theme UI

## Tech Stack
- **Backend:** Python, FastAPI, Gemini API, GitHub API
- **Frontend:** React.js
- **AI:** Google Gemini

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/Vedk1806/code-review-agent.git
cd code-review-agent
```

### 2. Backend setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Create .env file
```bash
cp .env.example .env
```
Add your keys in `.env`:


GEMINI_API_KEY=your_gemini_api_key


GITHUB_TOKEN=your_github_token

### 4. Run backend
```bash
uvicorn main:app --reload
```

### 5. Run frontend
```bash
cd frontend
npm install
npm start
```

## Usage
1. Open `http://localhost:3000`
2. Paste GitHub PR URL
3. Click "Review PR"
4. Get instant AI review!
